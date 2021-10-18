import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressPageLayoutComponent } from './progress-page-layout/progress-page-layout.component';
import { AngularMaterialModule } from 'src/app/common/angular-material.module';
import { ProgressPageRoutingModule } from './_routing/progress-page.routing.module';
import { CommonSharedModule } from 'src/app/common/common-shared.module';
import { FileInfoTableComponent } from './file-info-table/file-info-table.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { FilePreviewDialogComponent } from './file-preview-dialog/file-preview-dialog.component';



@NgModule({
  declarations: [
    ProgressPageLayoutComponent,
    FileInfoTableComponent,
    ProgressBarComponent,
    FilePreviewDialogComponent
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    ProgressPageRoutingModule,
    AngularMaterialModule
  ]
})
export class ProgressPageModule { }

///
