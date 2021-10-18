import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeURLsLayoutComponent } from './type-urls-layout/type-urls-layout.component';
import { AngularMaterialModule } from 'src/app/common/angular-material.module';
import { TypeURLsRoutingModule } from './_routing/type-urls-page.routing.module';
import { CommonSharedModule } from 'src/app/common/common-shared.module';
import { TypeURLsPageService } from './type-urls-page.service';
import { ChoosePathDialogComponent } from './choose-path-dialog/choose-path-dialog.component';



@NgModule({
  declarations: [
    TypeURLsLayoutComponent,
    ChoosePathDialogComponent,
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    TypeURLsRoutingModule,
    AngularMaterialModule
  ],
  providers: [
    TypeURLsPageService
  ]
})
export class TypeURLsPageModule { }
