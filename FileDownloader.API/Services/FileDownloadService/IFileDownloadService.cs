using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileDownloader.API.Models;

namespace FileDownloader.API.Services
{
    public interface IFileDownloadService
    {
        Task DownloadAllFilesToDevice();
        Task<DownloadResult> DownloadAllFilesToZip();
        Task DownloadSingleFiletoDevice(FileInfo fileInfo);
    }
}