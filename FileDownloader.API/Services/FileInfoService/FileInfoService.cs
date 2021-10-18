using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FileDownloader.API.Hubs;
using FileDownloader.API.Models;
using Microsoft.AspNetCore.SignalR;

namespace FileDownloader.API.Services
{
    public class FileInfoService : IFileInfoService
    {
        private readonly IHubContext<ProgressHub> _hubContext;

        private static readonly Regex filenameFromUrl = new Regex (@"\/([^\/]*\.[a-z]{3})(?:\\r)?$", RegexOptions.Compiled);
        private static readonly Regex filenameFromContentDisposition = new Regex (@"filename=""([\w]+\.[a-z]{3})""", RegexOptions.Compiled);
        private ObservableCollection<FileInfo> _listOfFiles = new ObservableCollection<FileInfo>();
        private float _length;
        
        public FileInfoService(IHubContext<ProgressHub> hubContext)
        {
            this._hubContext = hubContext;
            this._listOfFiles.CollectionChanged += InformProgress;
        }

        public string[] GetURLsFromString(string joinedURLs)
        {
            if(joinedURLs.Contains("\\r") || joinedURLs.Contains('\r')) return joinedURLs.Split("\r\n");
            return joinedURLs.Split('\n');
        }

        public async Task<FileInfo> GetInfosFromSingleUrl(string url) {
            var singleUrlArray = new string[1];
            singleUrlArray[0] = url;
            var list = await GetInfosFromURLs(singleUrlArray);
            return list[0];
        }

        public async Task<List<FileInfo>> GetInfosFromURLs(string[] URLs)
        {
            _length = URLs.Length;
            for (int i = 0; i < URLs.Length; i++)
            {
                try
                {
                    using var webClient = new WebClient();
                    await webClient.OpenReadTaskAsync(URLs[i]);
                    string size = webClient.ResponseHeaders["Content-Length"] ?? "unknown";
                    string name;
                    if(webClient.ResponseHeaders["Content-Disposition"] is var content && content is not null)
                    {
                        name = GetFilenameFromContentDisposition(content);
                    } 
                    else
                    {
                        name = GetFilenameFromUrl(URLs[i]);
                    }

                    var info = new FileInfo(
                        i,
                        name,
                        ToKiloBytes(size),
                        URLs[i],
                        new Uri(URLs[i]),
                        isValid: true
                    );
                    _listOfFiles.Add(info);
                }
                catch
                {
                    var info = new FileInfo(
                        i,
                        "An error ocurred",
                        0,
                        URLs[i],
                        new Uri(URLs[i]),
                        isValid: false
                    );
                    _listOfFiles.Add(info);
                }

            }

            return _listOfFiles.ToList();
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

        public async void InformProgress(object sender, EventArgs args) {
            var percentage = Convert.ToInt32(((float) _listOfFiles.Count / _length) * 100);
            await _hubContext.Clients.All.SendAsync("FileInfoProgressUpdate", new ProgressInfo(0, percentage));
        }
    }
}