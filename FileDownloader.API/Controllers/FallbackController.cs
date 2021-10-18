using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace FileDownloader.API.Controllers
{
    public class FallbackController : Controller
    {
        public ActionResult Index() {
            var indexPath = Path.Combine(
                Directory.GetCurrentDirectory(), "wwwroot", "index.html"
            );
            return PhysicalFile(indexPath, "text/HTML");
        }
    }
}