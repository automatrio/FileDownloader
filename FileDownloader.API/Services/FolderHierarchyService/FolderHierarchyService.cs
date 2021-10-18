using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FileDownloader.API.Models;

namespace FileDownloader.API.Services
{
    public class FolderHierarchyService : IFolderHierarchyService
    {
        public static readonly Regex _split = new Regex(@"(^\/?[^\\\/]+(?:\\|\/)|[^\\\/]+(?:\\|\/)|[^\\\/]+$)", RegexOptions.Compiled);
        public static readonly Regex _lastDir = new Regex(@"([^\\\/]+$)", RegexOptions.Compiled);

        public static readonly int _maxIterations = 2;

        public FolderHierarchyService()
        {
        }

        public Folder GetHierarchyFromRoot() {
            var cwd = Directory.GetCurrentDirectory();
            var currentDirectoryStructure = _split.Matches(cwd);
            var rootDir = currentDirectoryStructure[0].Value;

            var rootHierarchy = new Folder(
                name: rootDir,
                path: rootDir,
                children: GenerateChildren(rootDir).ToList()
            );

            return rootHierarchy;
        }

        public Folder GetHierarchyFromFolder(Folder folder) {

            var folderHierarchy = new Folder(
                name: folder.Name,
                path: folder.Path,
                children: GenerateChildren(folder.Path).ToList()
            );

            return folderHierarchy;
        }

        private static IEnumerable<Folder> GenerateChildren(string currentWorkingPath, int currentIteration = 0)
        {
            string[] children;
            try {
                children = Directory.GetDirectories(currentWorkingPath);
            }
            catch {
                children = new string[0];
            }

            foreach(var child in children) {
                var childName = _lastDir.Match(child).Value;
                
                if(childName[0] == '.') continue;

                var newDepth = currentIteration + 1;

                yield return new Folder(
                    name: childName,
                    path: child,
                    children: newDepth < _maxIterations
                        ?   GenerateChildren(child, newDepth).ToList()
                        :   null
                );
            }
        }
    }
}