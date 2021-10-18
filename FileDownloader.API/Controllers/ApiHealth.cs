using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace FileDownloader.API.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class ApiHealth : ControllerBase
    {
        [HttpGet]
        public ActionResult<string> Get() {
            return Ok(new { message = "API is working just fine." });
        }
    }
}