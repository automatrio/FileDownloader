using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileDownloader.API.Models
{
    public class Folder
    {
        public Folder(string name, string path, List<Folder> children)
        {
            Name = name;
            Path = path;
            Children = children;
        }

        public string Name { get; }
        public string Path { get; }

        #nullable enable
        public List<Folder>? Children { get; set; }
        #nullable disable
    }
}