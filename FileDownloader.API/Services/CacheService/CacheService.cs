using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileDownloader.API.Models;
using FileDownloader.API.Utils;

namespace FileDownloader.API.Services
{
    public class CacheService : ICacheService
    {
        private List<FileInfo> _currentFileInfoList { get; set; }
        private int _cuncorrentOperations = 10;
        private EFileDownloadMode _fileDownloadMode = EFileDownloadMode.ToDevice; 
        private string _destinationFolder = string.Empty;
        private string _pathToZipFile;


        public List<FileInfo> GetFileInfoList() => _currentFileInfoList;
        public void SetFileInfoList(List<FileInfo> list) => this._currentFileInfoList = list;


        public int GetMaxCuncorrentOperations() => _cuncorrentOperations;
        public void SetMaxCuncorrentOperations(int value) => _cuncorrentOperations = value;


        public EFileDownloadMode GetFileDownloadMode() => _fileDownloadMode;
        public void SetFileDownloadMode(EFileDownloadMode value) => _fileDownloadMode = value;

        public string GetDestinationFolder() => _destinationFolder;
        public void SetDestinationFolder(string path) => _destinationFolder = path;

        public string GetPathToZipFile() => _pathToZipFile;
        public string SetPathToZipFile(string path) => _pathToZipFile = path; 

    }
}