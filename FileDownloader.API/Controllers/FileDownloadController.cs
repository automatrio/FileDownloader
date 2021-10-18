using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using FileDownloader.API.Models;
using FileDownloader.API.Services;
using FileDownloader.API.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FileDownloader.API.Controllers
{
    [ApiController]
    [Route("api/file-download")]
    public class FileDownloadController : ControllerBase
    {
        private readonly IFileDownloadService _fileDownloadService;
        private readonly ICacheService _cacheService;

        public FileDownloadController(IFileDownloadService fileDownloadService, ICacheService cacheService)
        {
            _cacheService = cacheService;
            _fileDownloadService = fileDownloadService;
        }

        [HttpGet]
        public async Task<ActionResult<DownloadResult>> InitiateDownloads()
        {
            try
            {
                if(_cacheService.GetFileDownloadMode() == EFileDownloadMode.ToDevice)
                {
                    await _fileDownloadService.DownloadAllFilesToDevice();
                    return Ok();
                }
                else
                {
                    var result = await _fileDownloadService.DownloadAllFilesToZip();
                    _cacheService.SetPathToZipFile(result.PathToZipFile);
                    return Ok(result);
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet("zip-file")]
        public async Task<FileResult> DownloadZipFile() {
            var pathToZipFile = _cacheService.GetPathToZipFile();
            var memoryStream = new MemoryStream();
            using(var fileStream = new FileStream(pathToZipFile, FileMode.Open))
            {
                await fileStream.CopyToAsync(memoryStream);
            }
            memoryStream.Seek(0, SeekOrigin.Begin);
            System.IO.File.Delete(pathToZipFile);
            return File(memoryStream, "application/zip");;
        }

        [HttpPost]
        public async Task<ActionResult> RetryToDownloadFile([FromBody] int fileInfoId)
        {
            try
            {
                var cachedFileInfo = _cacheService.GetFileInfoList().SingleOrDefault(_ => _.Id == fileInfoId);
                await _fileDownloadService.DownloadSingleFiletoDevice(cachedFileInfo);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}