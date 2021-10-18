using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
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

        public async Task DownloadAllFilesToDevice() {
            var fileInfos = _cacheService.GetFileInfoList();
            int amountOfBundles = (int) Math.Ceiling((float) fileInfos.Count / _cacheService.GetMaxCuncorrentOperations()); 

            var concurrentTasks = new List<Task>(_cacheService.GetMaxCuncorrentOperations());

            for (int i = 0; i < amountOfBundles; i++)
            {
                for (int j = 0; j < _cacheService.GetMaxCuncorrentOperations(); j++)
                {
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

        public async Task DownloadSingleFiletoDevice(Models.FileInfo fileInfo)
        {
            await DownloadFile(fileInfo);
        }

        private Task DownloadFile(Models.FileInfo fileInfo) {  
            var client = new WebClient();
            client.DownloadProgressChanged += (_, args) => SendNotification(fileInfo.Id, args);
            
            return Task.Run(() => {             
                var path = _destinationPath + fileInfo.FileName;
                var uri = new Uri(fileInfo.Url);
                client.DownloadFileAsync(uri, path);
            }).ContinueWith(task => {
                if(task.IsFaulted) throw task.Exception;
                client.Dispose();
            });
        }

        public async Task<DownloadResult> DownloadAllFilesToZip() {  
            var fileInfos = _cacheService.GetFileInfoList();
            var tempFolderPath = Path.GetTempPath();
            string filePath;
            var result = new DownloadResult();

            using(var outerStream = new MemoryStream()) {

                using(var archive = new ZipArchive(outerStream, ZipArchiveMode.Create, true)) {

                    foreach(var fileInfo in fileInfos) {
                        await DownloadFileToZipAsync(
                            fileInfo,
                            archive,
                            result
                        );
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

        private async Task DownloadFileToZipAsync(Models.FileInfo fileInfo, ZipArchive archive, DownloadResult result) {
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