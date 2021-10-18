import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomePageLayoutComponent } from '../welcome-page-layout/welcome-page-layout.component';


@NgModule({
  imports: [
    RouterModule.forChild([
        {path: "", component: WelcomePageLayoutComponent}
    ])
  ], 
  exports: [
    RouterModule
  ]
})
export class WelcomePageRoutingModule { }
