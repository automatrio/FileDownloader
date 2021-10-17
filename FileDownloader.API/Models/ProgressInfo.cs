using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownloader.API.Models
{
    public struct ProgressInfo {
        public ProgressInfo(int fileId, int percentage)
        {
            FileId = fileId;
            Percentage = percentage;
        }

        public int FileId { get; }
        public int Percentage { get; }
    }
}