using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FileDownloader.API.Hubs;
using FileDownloader.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;

namespace FileDownloader.API.Services
{
    public class FileParsingService : IFileParsingService
    {
        private readonly IHubContext<ProgressHub> _hubContext;

        public FileParsingService(IHubContext<ProgressHub> hubContext)
        {
            this._hubContext = hubContext;
        }

        public async Task<string> ParseFile(IFormFile file){
            var content = new char[file.Length];

            var memoryStream = new MemoryStream();

            await file.CopyToAsync(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);

            float length = file.Length;
            int lastValue = -1;


            using(var streamReader = new StreamReader(memoryStream)) {
                for (int i = 0; i < content.Length; i++)
                {
                    content[i] = (char) streamReader.Read();
                    var percentage = Convert.ToInt32(((float) i / length) * 100);
                    if(percentage != lastValue) await InformProgress(percentage);
                    lastValue = percentage;
                }
            }

            await memoryStream.DisposeAsync();

            return new string(content);
        }

        public async Task InformProgress(int percentage) {
            await _hubContext.Clients.All.SendAsync("FileParsingProgressUpdate", new ProgressInfo(0, percentage));
        }

    }
}