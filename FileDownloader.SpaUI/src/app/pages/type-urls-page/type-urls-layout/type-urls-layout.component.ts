import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ViewModel } from 'src/app/common/models/view-model';
import { DataTransferService } from 'src/app/common/services/data-transfer.service';
import { ChoosePathDialogComponent } from '../choose-path-dialog/choose-path-dialog.component';
import { TypeURLsPageService } from '../type-urls-page.service';
import { URLs } from '../_models/urls.view-model';

@Component({
  selector: 'app-type-urls-layout',
  templateUrl: './type-urls-layout.component.html',
  styleUrls: ['./type-urls-layout.component.scss']
})
export class TypeURLsLayoutComponent implements AfterContentInit {

  viewModel: ViewModel<URLs>;
  directory: string;

  constructor(
    private typeURLsService: TypeURLsPageService,
    private dataTransferService: DataTransferService,
    private dialogService: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private router: Router
    ) {
      this.viewModel = this.typeURLsService.initiateViewModel();
      this.viewModel.model!.joinedURLs = this.dataTransferService.getDataAcrossRouting("URLs") ?? "";
    }

  ngAfterContentInit(): void {
    this.changeDetector.detectChanges();
  }

  public onDownloadQueried(mode: "zip" | "device") {
    const URLs = this.viewModel.form!.get("listOfURLs")?.value;
    this.dataTransferService.sendDataAcrossRouting("URLs", URLs);
    this.dataTransferService.sendDataAcrossRouting("mode", mode);
    this.router.navigateByUrl("/progress");
  }

  public get textArea() { return this.viewModel.form?.get("listOfURLs"); }

  public openChoosePathDialog() {
    const componentRef = this.dialogService.open(ChoosePathDialogComponent, {
      width: '60vw',
      height: '80vh',
      hasBackdrop: true,
      backdropClass: "overlay-backdrop",
      data: this.directory
    });
    componentRef.componentInstance.pathChosenSuccessfully.subscribe(destinationPath => {
      this.typeURLsService.setDestinationPath(destinationPath).subscribe(() => {
        componentRef.close();
        this.onDownloadQueried("device");
      });
    });
  }

}
