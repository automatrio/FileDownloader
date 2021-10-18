using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownloader.API.Models
{
    public struct FileInfo
    {
        public FileInfo(int id, string fileName, int size, string url, Uri uri, bool isValid = true)
        {
            Id = id;
            FileName = fileName;
            Size = size;
            Url = url;
            IsValid = isValid;
        }

        public int Id { get; }
        public string FileName { get; }
        public int Size { get; }
        public string Url { get;}
        public bool IsValid { get ;set; }
    }
}