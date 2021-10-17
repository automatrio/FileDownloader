using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownloader.API.Models
{
    public class DownloadResult
    {
        public List<FileInfo> FailedFiles { get; set; } = new List<FileInfo>();
        public List<string> Errors { get; set;} = new List<string>();
        public string PathToZipFile { get; set; }
    }
}