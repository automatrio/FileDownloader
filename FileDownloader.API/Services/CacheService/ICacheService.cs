using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileDownloader.API.Models;
using FileDownloader.API.Utils;

namespace FileDownloader.API.Services
{
    public interface ICacheService
    {
        List<FileInfo> GetFileInfoList();
        void SetFileInfoList(List<FileInfo> list);

        int GetMaxCuncorrentOperations();
        void SetMaxCuncorrentOperations(int value);

        EFileDownloadMode GetFileDownloadMode();
        void SetFileDownloadMode(EFileDownloadMode value);
        
        string GetDestinationFolder();
        void SetDestinationFolder(string path);

        string GetPathToZipFile();
        string SetPathToZipFile(string path);
    }
}