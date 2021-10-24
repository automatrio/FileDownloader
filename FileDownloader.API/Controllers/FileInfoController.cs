using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FileDownloader.API.Models;
using FileDownloader.API.Services;
using FileDownloader.API.Utils;
using Microsoft.AspNetCore.Mvc;

namespace FileDownloader.API.Controllers
{
    [ApiController]
    [Route("api/file-infos")]
    public class FileInfoController : ControllerBase
    {
        private readonly IFileInfoService _fileInfoService;
        private readonly ICacheService _cacheService;

        public FileInfoController(IFileInfoService fileInfoService, ICacheService cacheService)
        {
            _fileInfoService = fileInfoService;
            _cacheService = cacheService;
        }

        [HttpPost]
        public async Task<ActionResult<List<FileInfo>>> GetInfosFromJoinedURLsString(URLs dto, CancellationToken cToken) 
        {
            string[] URLs = _fileInfoService.GetURLsFromString(dto.JoinedURLs);
            var list = await _fileInfoService.GetInfosFromURLs(URLs, cToken);
            _cacheService.SetFileInfoList(list);
            _cacheService.SetFileDownloadMode(
                dto.Mode == "zip"
                ?   EFileDownloadMode.ToZip
                :   EFileDownloadMode.ToDevice
            );
            return Ok(list);
        }

        [HttpPost("single")]
        public async Task<ActionResult<FileInfo>> GetSingleFileInfo(string url, CancellationToken cToken) {
            try 
            {
                var fileInfo = await _fileInfoService.GetInfosFromSingleUrl(url, cToken);
                return Ok(fileInfo);
            }
            catch 
            {
                return BadRequest();
            }
        }
    }
}