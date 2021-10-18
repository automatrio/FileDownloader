using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownloader.API.Helpers
{
    public static class PathHelper
    {
        public static string CheckPathTrailingDash(string path) {
            var lastCharIndex = path.Length - 1;
            if(path[lastCharIndex] != '/') {
                return path + '/';
            }
            else return path;
        }
    }
}