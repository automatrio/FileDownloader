import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageLayoutComponent } from './welcome-page-layout/welcome-page-layout.component';
import { ButtonCardComponent } from './button-card/button-card.component';
import { WelcomePageRoutingModule } from './_routing/welcome-page.routing.module';
import { CommonSharedModule } from 'src/app/common/common-shared.module';



@NgModule({
  declarations: [
    WelcomePageLayoutComponent,
    ButtonCardComponent
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
    WelcomePageRoutingModule
  ], 
  exports: [
    WelcomePageLayoutComponent,
    ButtonCardComponent
  ]
})
export class WelcomePageModule { }
