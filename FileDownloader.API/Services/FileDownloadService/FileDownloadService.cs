using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FileDownloader.API.Hubs;
using FileDownloader.API.Models;
using FileDownloader.API.Utils;
using Microsoft.AspNetCore.SignalR;

namespace FileDownloader.API.Services
{
    public class FileDownloadService : IFileDownloadService
    {
        private readonly IHubContext<ProgressHub> _hubContext;
        private readonly ICacheService _cacheService;
        private readonly string _destinationPath;

        public FileDownloadService(
                IHubContext<ProgressHub> hubContext,
                ICacheService cacheService) {
            this._hubContext = hubContext;
            this._cacheService = cacheService;
            this._destinationPath = _cacheService.GetDestinationFolder();
        }

        public async Task DownloadAllFilesToDevice(CancellationToken cToken) {
            var fileInfos = _cacheService.GetFileInfoList();
            int amountOfBundles = (int) Math.Ceiling((float) fileInfos.Count / _cacheService.GetMaxCuncorrentOperations()); 

            var concurrentTasks = new List<Task>(_cacheService.GetMaxCuncorrentOperations());

            for (int i = 0; i < amountOfBundles; i++)
            {
                for (int j = 0; j < _cacheService.GetMaxCuncorrentOperations(); j++)
                {
                    cToken.ThrowIfCancellationRequested();
                    int index = j + i * _cacheService.GetMaxCuncorrentOperations();
                    if(index == fileInfos.Count) break;
                    var currentFileInfo = fileInfos[index];

                    if(!currentFileInfo.IsValid) continue;

                    if(currentFileInfo.FileName == "An error ocurred") continue;

                    concurrentTasks.Add(
                        DownloadFile(currentFileInfo)
                        );
                }
                await Task.WhenAll(concurrentTasks);
                concurrentTasks.Clear();
            }
        }

        public async Task DownloadSingleFiletoDevice(CancellationToken cToken, Models.FileInfo fileInfo)
        {
            await DownloadFile(fileInfo);
        }

        public async Task<DownloadResult> DownloadSingleFileToZip(CancellationToken cToken, Models.FileInfo fileInfo) {
            return await DownloadAllFilesToZip(cToken, fileInfo);
        }

        private Task DownloadFile(Models.FileInfo fileInfo) {  
            var client = new WebClient();
            client.DownloadProgressChanged += (_, args) => SendNotification(fileInfo.Id, args);
            
            return Task.Run(() => {             
                var path = _destinationPath + fileInfo.FileName;
                var uri = new Uri(fileInfo.Url);
                client.DownloadFileAsync(uri, path);
            }).ContinueWith(async task => {
                await NotifyClientOfProgress(fileInfo.Id, 100);
                if(task.IsFaulted) throw task.Exception;
                client.Dispose();
            });
        }

        public async Task<DownloadResult> DownloadAllFilesToZip(CancellationToken cToken, Models.FileInfo fileInfo = default(Models.FileInfo)) {  
            var fileInfos = new List<Models.FileInfo>();
            if(fileInfo is null)
            {
                fileInfos = _cacheService.GetFileInfoList();
            }
            else
            {
                fileInfos.Add(fileInfo);
            }
            
            var tempFolderPath = Path.GetTempPath();
            string filePath;
            var result = new DownloadResult();

            using(var outerStream = new MemoryStream()) {

                using(var archive = new ZipArchive(outerStream, ZipArchiveMode.Create, true)) {

                    foreach(var info in fileInfos) {
                        cToken.ThrowIfCancellationRequested();
                        if(!info.IsValid) continue;
                        try {
                            await DownloadFileToZipAsync(
                                info,
                                archive
                            );
                        }
                        catch(Exception ex) {
                            result.FailedFiles.Add(info);
                            result.Errors.Add(ex.Message);
                        }
                    }
                }

                filePath = tempFolderPath + GetDateForFileName() + ".zip";

                using(var fileStream = new FileStream(filePath, FileMode.Create)) {
                    outerStream.Seek(0, SeekOrigin.Begin);
                    outerStream.CopyTo(fileStream);
                }

                result.PathToZipFile = filePath;
            }
            return result;
        }

        private async Task DownloadFileToZipAsync(Models.FileInfo fileInfo, ZipArchive archive) {
            using (WebClient client = new WebClient())
            {
                client.DownloadProgressChanged += (_, args) => SendNotification(fileInfo.Id, args);

                using(var innerStream = new MemoryStream(await client.DownloadDataTaskAsync(fileInfo.Url))) {
                    var entryFromFile = archive.CreateEntry(fileInfo.FileName);

                    using(var entryStream = entryFromFile.Open()) {
                        innerStream.CopyTo(entryStream);
                    }
                }
            }
        }

        private string GetDateForFileName() {
            var now = DateTime.Now;
            var relevantTime = new int[6] {now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second};
            string result = string.Empty;
            foreach(var time in relevantTime) {
                result += time;
            }
            return result;
        }

        private async void SendNotification(int fileInfoId, DownloadProgressChangedEventArgs args) {
            await NotifyClientOfProgress(fileInfoId, args.ProgressPercentage);
            return;
        }

        private async Task NotifyClientOfProgress(int fileId, int percentage) => 
            await _hubContext.Clients.All.SendAsync("ProgressUpdate", new ProgressInfo(fileId, percentage));

    }
}