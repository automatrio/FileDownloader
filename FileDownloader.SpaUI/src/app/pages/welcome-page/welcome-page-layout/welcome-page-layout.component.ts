import { HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PAGE_TRANSITION } from 'src/app/common/animations/page-transition';
import { DataTransferService } from 'src/app/common/services/data-transfer.service';
import { SignalRService } from 'src/app/common/services/signal-r.service';
import { SpinnerService } from 'src/app/common/services/spinner.service';
import { URLs } from '../../type-urls-page/_models/urls.view-model';
import { WelcomePageService } from '../welcome-page.service';

@Component({
  selector: 'app-welcome-page-layout',
  templateUrl: './welcome-page-layout.component.html',
  styleUrls: ['./welcome-page-layout.component.scss'],
  animations: [
    PAGE_TRANSITION
  ]
})
export class WelcomePageLayoutComponent implements OnInit {

  private baseMessage = "Parsing data: "
  private uploadProgress = new BehaviorSubject<string>(this.baseMessage);

  properties = {
    buttonOneColor: "3,198,70",
    buttonTwoColor: "3,70,198",
    buttonOneLabel: 'Type URLS',
    buttonTwoLabel: 'Load from file',
    buttonOneRouterLink: "/type",
    buttonTwoRouterLink: null,
  }

  @ViewChild('fileInput', {static: true}) fileInput: ElementRef<HTMLInputElement>;

  uploadFilePath: string;


  constructor(
    private welcomePageService: WelcomePageService,
    private dataTransferService: DataTransferService,
    private spinnerService: SpinnerService,
    private signalRService: SignalRService,
    private router: Router) { }

  ngOnInit(): void {
    this.signalRService.createHubConnection();
    this.subscribeToProgressUpdates();
  }

  public uploadFile() {
    this.fileInput.nativeElement.click();
  }

  public onFileChosen() {
    const file = this.fileInput?.nativeElement?.files![0];
    this.welcomePageService
      .uploadFile(file)
      .subscribe(response => {
        switch (response.type) {
          case HttpEventType.UploadProgress:
            {
              const event = (response as HttpProgressEvent);
              this.spinnerService.showSpinner();
              this.spinnerService.setObservableMessage(this.uploadProgress.asObservable());
            }
            break;
          case HttpEventType.Response:
            setTimeout(() => this.spinnerService.hideSpinner(), 600);
            const event = (response as HttpResponse<URLs>);
            const URLs = event.body!.joinedURLs;
            this.dataTransferService.sendDataAcrossRouting("URLs", URLs);
            this.router.navigateByUrl('/type');
            break;
          default:
            break;
        }
      });
  }

  private subscribeToProgressUpdates() {
    this.signalRService.uploadProgressInfo.subscribe(update => {
      this.uploadProgress.next(this.baseMessage + update.percentage + "%");
    });
  }

}
