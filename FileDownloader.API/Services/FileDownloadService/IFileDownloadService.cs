using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FileDownloader.API.Models;

namespace FileDownloader.API.Services
{
    public interface IFileDownloadService
    {
        Task DownloadAllFilesToDevice(CancellationToken cToken);
        Task<DownloadResult> DownloadAllFilesToZip(CancellationToken cToken, Models.FileInfo fileInfo = default(Models.FileInfo));
        Task DownloadSingleFiletoDevice(CancellationToken cToken, FileInfo fileInfo);
        Task<DownloadResult> DownloadSingleFileToZip(CancellationToken cToken, Models.FileInfo fileInfo);
    }
}