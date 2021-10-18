using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using FileDownloader.API.Helpers;
using FileDownloader.API.Models;
using FileDownloader.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FileDownloader.API.Controllers
{
    [ApiController]
    [Route("api/path")]
    public class PathController : ControllerBase
    {
        private readonly ICacheService _cacheService;
        private readonly IFolderHierarchyService _folderHierarchyService;

        public PathController(ICacheService cacheService, IFolderHierarchyService folderHierarchyService)
        {
            this._cacheService = cacheService;
            this._folderHierarchyService = folderHierarchyService;
        }

        [HttpGet("from-root")]
        public ActionResult<Folder> GetRootHierarchy() {
            var rootHierarchy = _folderHierarchyService.GetHierarchyFromRoot();
            return Ok(rootHierarchy);
        }

        [HttpPost("from-folder")]
        public ActionResult<Folder> GetFolderHierarchy(Folder folder) {
            var folderHierarchy = _folderHierarchyService.GetHierarchyFromFolder(folder);
            return Ok(folderHierarchy);
        }

        [HttpPost("set")]
        public ActionResult SetDestinationPath([FromBody] PathValidation path) {
            var destination = PathHelper.CheckPathTrailingDash(path.Path);
            this._cacheService.SetDestinationFolder(destination);
            return Ok();
        }
        
        [HttpPost]
        public ActionResult ValidatePath([FromBody] PathValidation pathDto)
        {
            if(Directory.Exists(pathDto.Path)) {
                return Ok();
            }
            return BadRequest();
        }
    }
}