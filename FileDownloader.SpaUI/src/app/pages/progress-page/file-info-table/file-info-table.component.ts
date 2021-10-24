import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ViewModel } from 'src/app/common/models/view-model';
import { DataTransferService } from 'src/app/common/services/data-transfer.service';
import { SignalRService } from 'src/app/common/services/signal-r.service';
import { SpinnerService } from 'src/app/common/services/spinner.service';
import { DownloadProgressService } from '../download-progress.service';
import { FilePreviewDialogComponent } from '../file-preview-dialog/file-preview-dialog.component';
import { eStatus } from '../_enums/e-status.enum';
import { DownloadResult } from '../_models/download-result.model';
import { FileInfo } from '../_models/file-info.view-model';

@Component({
  selector: 'app-file-info-table',
  templateUrl: './file-info-table.component.html',
  styleUrls: ['./file-info-table.component.scss']
})
export class FileInfoTableComponent implements OnInit {

  private _listOfURLs: string;
  private _baseMessage = "Fetching metadata: "
  private _uploadProgress = new BehaviorSubject<string>(this._baseMessage);

  viewModel: ViewModel<FileInfo>;

  constructor(
      private progressService: DownloadProgressService,
      private signalRService: SignalRService,
      private dataTransferService: DataTransferService,
      private spinnerService: SpinnerService,
      private dialogService: MatDialog,
      private snackbarService: MatSnackBar,
      private router: Router) {
    this.dataTransferService.getDataAcrossRouting("URLs");
  }

  async ngOnInit() {
    this.viewModel = this.progressService.initiateViewModel();
    this.signalRService.createHubConnection();

    this.subscribeToFileInfoProgressUpdates();
    const model = await this.getListOfURLs();
    this.filter(model).then(async () => {
      this.subscribeToDownloadProgressUpdates();
      this.initiateDownloads().then(results => {
        if(results) {
          this.changeStatusForAllFinishedDownloads(results);
          this.downloadZipFile();
          this.signalRService.disconnect();
        }
      });
    });
  }

  public previewPicture(fileInfo: FileInfo) {
    const dialogRef = this.dialogService.open(FilePreviewDialogComponent, {
      width: '80vw',
      height: '80vh',
      data: {source: fileInfo.url}
    });
  }

  public async retry(fileInfo: FileInfo) {
    const newFileInfo = await this.getFileInfo(fileInfo);
    this.retryToDownloadFile(newFileInfo);
  }

  private initiateDownloads(hadErrorBefore: boolean = false) {
    return new Promise<DownloadResult | null>(resolve => {
      this.progressService
        .initiateDownload()
        .subscribe(response => {
          console.log("All downloads have finished.");
          if(response != null) {
            resolve(response as DownloadResult);
          }
        }, error => {
          const problematic = this.viewModel.filterResult.filter(item => {item.status != eStatus.success});
          problematic.forEach(item => {
            if(!hadErrorBefore) {
              console.log("Error, retrying...")
              this.initiateDownloads(true);
            } else {
              resolve(null);
            }
          })
        });
    });
  }

  private downloadZipFile() {
    console.log("initiating zip download");
    this._baseMessage
    this.spinnerService.toggleLoading("Fetching .zip file...");
    this.progressService
      .downloadZipFile()
      .subscribe(response => {
        this.spinnerService.hideSpinner();
        const downloadedFile = new Blob([(response as HttpResponse<Blob>).body!], {type: "application/zip"});
        const url = URL.createObjectURL(downloadedFile);
        window.location.assign(url);
      });
    
  }

  private getFileInfo(fileInfo: FileInfo) {
    return new Promise<FileInfo>(resolve => {

      fileInfo.status = 1;
      this.progressService
        .retryGetFileInfo(fileInfo.url)
        .subscribe(response => {
          fileInfo.fileName = (response as FileInfo).fileName;
          fileInfo.size     = (response as FileInfo).size;
          fileInfo.status   = 2;
          resolve(fileInfo);
        }, error => {
          fileInfo.status = 3;
      });
    });
  }

  private retryToDownloadFile(fileInfo: FileInfo) {
    this.progressService.retryDownloadFile(fileInfo).subscribe(result => {
      if(result) {
        this.changeStatusForAllFinishedDownloads(result as DownloadResult);
      }
    });
  }


  private filter(filterModel: any) {
    return new Promise<void>(resolve => {
      this.spinnerService.showSpinner();
      this.spinnerService.setObservableMessage(this._uploadProgress.asObservable());
      this.progressService
        .getFileInfos(filterModel)
        .subscribe(response => {
          this.spinnerService.hideSpinner();
          this.viewModel.filterResult = Array.from(response as FileInfo[]).map(data => {
            return new FileInfo(
              data.id,
              data.fileName,
              data.size,
              data.url,
            );
          });
        resolve();
        },
        error => {
          this.spinnerService.hideSpinner();
          this.router.navigateByUrl("/type");
          this.snackbarService.open("Sorry, but no metadata could be fetched!", "X");
        });
    });
  }

  private getListOfURLs() {
    return new Promise(resolve => {
      this._listOfURLs = this.dataTransferService.getDataAcrossRouting("URLs");
      const mode = this.dataTransferService.getDataAcrossRouting("mode");
      const model = {
        joinedURLs: this._listOfURLs ?? "",
        mode: mode
      };
      resolve(model);
    });
  }

  private subscribeToDownloadProgressUpdates() {
    this.signalRService.downloadProgressInfo.subscribe(update => {
      const itemToUpdate = this.viewModel.filterResult.find(item => item.id == update.fileId);
      itemToUpdate!.progress.next(update.percentage);
    });
  }

  private subscribeToFileInfoProgressUpdates() {
    this.signalRService.fileInfoProgressInfo.subscribe(update => {
      this._uploadProgress.next(this._baseMessage + update.percentage + "%")
    });
  }

  private changeStatusForAllFinishedDownloads(result: DownloadResult) {
    if(!result) return;
    if(!result.failedFiles) return;
    const failedFilesIds = result.failedFiles.map(fileInfo => fileInfo.id);
    this.viewModel.filterResult.forEach(file => {
      if(failedFilesIds.includes(file.id)) {
        file.status = eStatus.error;
      } else {
        file.status = eStatus.success;
      }
    });
  }
}
