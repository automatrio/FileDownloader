using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace FileDownloader.API.Services
{
    public interface IFileParsingService
    {
        Task<string> ParseFile(IFormFile file);
    }
}