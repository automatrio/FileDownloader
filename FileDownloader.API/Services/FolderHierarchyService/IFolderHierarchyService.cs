using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FileDownloader.API.Models;

namespace FileDownloader.API.Services
{
    public interface IFolderHierarchyService
    {
        Folder GetHierarchyFromRoot();
        Folder GetHierarchyFromFolder(Folder folder);
    }
}