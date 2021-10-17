import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageModule } from './welcome-page/welcome-page.module';
import { ProgressPageModule } from './progress-page/progress-page.module';
import { TypeURLsPageModule } from './type-urls-page/type-urls-page.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    WelcomePageModule,
    TypeURLsPageModule,
    ProgressPageModule,
  ]
})
export class PagesModule { }
