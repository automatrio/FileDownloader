import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TypeURLsLayoutComponent } from '../type-urls-layout/type-urls-layout.component';


@NgModule({
  imports: [
    RouterModule.forChild([
        {path: "", component: TypeURLsLayoutComponent}
    ])
  ], 
  exports: [
    RouterModule
  ]
})
export class TypeURLsRoutingModule { }
