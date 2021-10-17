import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconTrayComponent } from './icon-tray/icon-tray.component';
import { LogoComponent } from './logo/logo.component';



@NgModule({
  declarations: [
    IconTrayComponent,
    LogoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IconTrayComponent,
    LogoComponent
  ]
})
export class UserInterfaceModule { }
