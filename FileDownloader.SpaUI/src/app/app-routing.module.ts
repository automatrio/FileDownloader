import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgressPageModule } from './pages/progress-page/progress-page.module';
import { TypeURLsPageModule } from './pages/type-urls-page/type-urls-page.module';
import { WelcomePageModule } from './pages/welcome-page/welcome-page.module';

const routes: Routes = [
  { path: "", loadChildren: () => WelcomePageModule},
  { path: "welcome", loadChildren: () => WelcomePageModule},
  { path: "type", loadChildren: () => TypeURLsPageModule},
  { path: "progress", loadChildren: () => ProgressPageModule}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
