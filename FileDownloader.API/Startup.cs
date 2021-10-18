using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElectronNET.API;
using ElectronNET.API.Entities;
using FileDownloader.API.Hubs;
using FileDownloader.API.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace FileDownloader.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddCors(options => {
                options.AddDefaultPolicy(builder => {
                        builder.AllowAnyHeader();
                        builder.AllowAnyMethod();
                        builder.AllowCredentials();
                        builder.WithOrigins("https://localhost:4200");
                    });
                });
            services.AddScoped<IFileInfoService, FileInfoService>();
            services.AddScoped<IFileDownloadService, FileDownloadService>();
            services.AddScoped<IFolderHierarchyService, FolderHierarchyService>();
            services.AddScoped<IFileParsingService, FileParsingService>();
            services.AddSingleton<ICacheService, CacheService>();
            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors();

            app.UseAuthorization();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ProgressHub>("hub/progress");
                endpoints.MapFallbackToController("Index", "Fallback");
            });

            if(HybridSupport.IsElectronActive) {
                ElecronStartup();
            }
        }

        private async void ElecronStartup() {
            var window = await Electron.WindowManager.CreateWindowAsync(
                new BrowserWindowOptions() {
                    Width = 1000,
                    Height = 642,
                    Show = false
                }
            );

            window.SetTitle("Automatrio's FileDownloader");

            await window.WebContents.Session.ClearCacheAsync();

            window.OnReadyToShow += () => {
                window.Show();
            };

            window.OnClosed += () => {
                Electron.App.Quit();
            };
        }
    }
}
