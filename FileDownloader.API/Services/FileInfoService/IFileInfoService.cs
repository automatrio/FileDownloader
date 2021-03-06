using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FileDownloader.API.Models;

namespace FileDownloader.API.Services
{
    public interface IFileInfoService
    {
        string[] GetURLsFromString(string joinedURLs);
        Task<List<FileInfo>> GetInfosFromURLs(string[] URLs, CancellationToken cToken);
        Task<FileInfo> GetInfosFromSingleUrl(string url, CancellationToken cToken);
    }
}