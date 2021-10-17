using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileDownloader.API.Models;
using FileDownloader.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FileDownloader.API.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class FileUploadController : ControllerBase
    {
        private readonly IFileParsingService _fileParsingService;
        private readonly IFileInfoService _fileInfoService;
        private readonly ICacheService _cacheService;

        public FileUploadController(
            IFileParsingService fileParsingService,
            IFileInfoService fileInfoService,
            ICacheService cacheService)
        {
            this._fileParsingService = fileParsingService;
            this._fileInfoService = fileInfoService;
            this._cacheService = cacheService;
        }

        [HttpPost]
        public async Task<ActionResult<URLs>> UploadFile(IFormFile file) {
            try
            {
                var URLs = new URLs() {
                    JoinedURLs = await _fileParsingService.ParseFile(file)
                };
                return Ok(URLs);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}