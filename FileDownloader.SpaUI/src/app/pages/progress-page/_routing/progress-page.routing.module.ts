import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressPageLayoutComponent } from '../progress-page-layout/progress-page-layout.component';


@NgModule({
  imports: [
    RouterModule.forChild([
        {path: "", component: ProgressPageLayoutComponent}
    ])
  ], 
  exports: [
    RouterModule
  ]
})
export class ProgressPageRoutingModule { }
