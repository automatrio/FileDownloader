using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using FileDownloader.API.Hubs;
using FileDownloader.API.Models;
using Microsoft.AspNetCore.SignalR;

namespace FileDownloader.API.Services
{
    public class FileInfoService : IFileInfoService
    {
        private readonly IHubContext<ProgressHub> _hubContext;
        private readonly ICacheService _cacheService;
        private static readonly Regex filenameFromUrl = new Regex (@"\/([^\/]*\.[a-zA-Z]{3,4})(?:\\r)?$", RegexOptions.Compiled);
        private static readonly Regex filenameFromContentDisposition = new Regex (@"filename=""([\w]+\.[a-zA-Z]{3,4})""", RegexOptions.Compiled);
        private ObservableCollection<Models.FileInfo> _listOfFiles = new ObservableCollection<Models.FileInfo>();
        private float _length;
        
        public FileInfoService(
            IHubContext<ProgressHub> hubContext,
            ICacheService cacheService)
        {
            this._hubContext = hubContext;
            this._cacheService = cacheService;
            this._listOfFiles.CollectionChanged += InformProgress;
        }

        public string[] GetURLsFromString(string joinedURLs)
        {
            if(joinedURLs.Contains("\\r") || joinedURLs.Contains('\r')) return joinedURLs.Split("\r\n");
            return joinedURLs.Split('\n');
        }

        public async Task<Models.FileInfo> GetInfosFromSingleUrl(string url, CancellationToken cToken) {
            var singleUrlArray = new string[1];
            singleUrlArray[0] = url;
            var list = await GetInfosFromURLs(singleUrlArray, cToken);
            return list[0];
        }

        public async Task<List<Models.FileInfo>> GetInfosFromURLs(string[] URLs, CancellationToken cToken)
        {
            _length = URLs.Length;

            int amountOfBundles = (int) Math.Ceiling(_length / _cacheService.GetMaxCuncorrentOperations()); 
            var concurrentTasks = new List<Task>(_cacheService.GetMaxCuncorrentOperations());

            for (int i = 0; i < amountOfBundles; i++)
            {
                for (int j = 0; j < _cacheService.GetMaxCuncorrentOperations(); j++)
                {
                    cToken.ThrowIfCancellationRequested();
                    int index = j + i * _cacheService.GetMaxCuncorrentOperations();
                    if(index == _length) break;
                    concurrentTasks.Add(DownloadMetadata(URLs, index));
                }
                await Task.WhenAll(concurrentTasks);
                concurrentTasks.Clear();
            }

            return _listOfFiles
                .Where(_ => _ is not null)
                .OrderBy(_ => _.Id).ToList();
        }

        private static int ToKiloBytes(string sizeInBytes)
        {
            if (Int32.TryParse(sizeInBytes, out int result))
            {
                return Convert.ToInt32(result * 0.001);
            }
            return 0;
        }

        private static string GetFilenameFromUrl(string url)
        {
            var match = filenameFromUrl.Match(url);
            return match.Groups[1].Value;
        }

        private static string GetFilenameFromContentDisposition(string url)
        {
            return filenameFromContentDisposition.Match(url).Groups[1].Value;
        }

        private Task DownloadMetadata(string[] URLs, int index) {
            return Task.Run(async () => {
                Stream stream = default(Stream);
                using var webClient = new WebClient();
                var uri = new Uri(URLs[index]);
                try
                {
                    stream = await webClient.OpenReadTaskAsync(uri);
                    string size = webClient.ResponseHeaders["Content-Length"] ?? "unknown";
                    string name;
                    if (webClient.ResponseHeaders["Content-Disposition"] is var content && content is not null)
                    {
                        name = GetFilenameFromContentDisposition(content);
                    }
                    else
                    {
                        name = GetFilenameFromUrl(URLs[index]);
                    }

                    var info = new Models.FileInfo(
                        index,
                        name,
                        ToKiloBytes(size),
                        URLs[index],
                        new Uri(URLs[index]),
                        isValid: true
                    );
                    _listOfFiles.Add(info);
                    await stream.DisposeAsync();
                }
                catch (Exception ex)
                {
                    var info = new Models.FileInfo(
                        index,
                        $"Error: {ex.Message.Substring(0, 52)}...",
                        0,
                        URLs[index],
                        new Uri(URLs[index]),
                        isValid: false
                    );
                    _listOfFiles.Add(info);
                }
                webClient.Dispose();
            });
        }

        public async void InformProgress(object sender, EventArgs args) {
            var percentage = Convert.ToInt32(((float) _listOfFiles.Count / _length) * 100);
            await _hubContext.Clients.All.SendAsync("FileInfoProgressUpdate", new ProgressInfo(0, percentage));
        }
    }
}