import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ApiService } from 'src/app/common/services/api.service';
import { FileInfo } from './_models/file-info.view-model';
import { ViewModel } from 'src/app/common/models/view-model';
import { ProgressInfo } from './_models/progress-info.model';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadProgressService {

  constructor(private apiService: ApiService) { }

  public initiateViewModel() {
    return {
      model: undefined,
      form: undefined,
      filterResult: []
    } as ViewModel<FileInfo>;
  }


  public initiateDownload() {
    return this.apiService.setResource("file-download").get();
  }

  public getFileInfos(URLs: any) {
    return this.apiService.setResource("file-infos").post(URLs);
  }

  public downloadZipFile() {
    return this.apiService.setResource("file-download").setSubResource("zip-file").download();
  }

  public retryGetFileInfo(fileInfoUrl: string) {
    return this.apiService.setResource("file-infos").post(fileInfoUrl);
  }

  public retryDownloadFile(fileInfo: FileInfo) {
    return this.apiService.setResource("file-download").post(fileInfo.id);
  }

  public checkApiHealth() {
    return this.apiService.setResource("health").get();
  }
}
