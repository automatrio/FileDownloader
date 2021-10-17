import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ReplaySubject } from 'rxjs';
import { ProgressInfo } from 'src/app/pages/progress-page/_models/progress-info.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  hubUrl = environment.hubUrl + 'progress'; 
  downloadProgressInfo = new ReplaySubject<ProgressInfo>(1);
  uploadProgressInfo = new ReplaySubject<ProgressInfo>(1);
  fileInfoProgressInfo = new ReplaySubject<ProgressInfo>(1);

  private hubConnection: HubConnection;

  constructor() { }

  public createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection
      .on('ProgressUpdate', (update: ProgressInfo) => {
        this.downloadProgressInfo.next(update);
      });

    this.hubConnection
      .on('FileParsingProgressUpdate', (update: ProgressInfo) => {
        this.uploadProgressInfo.next(update);
      });

    this.hubConnection
      .on('FileInfoProgressUpdate', (update: ProgressInfo) => {
        this.fileInfoProgressInfo.next(update);
      });
  }

  public async disconnect() {
    await this.hubConnection.stop();
  }
}
