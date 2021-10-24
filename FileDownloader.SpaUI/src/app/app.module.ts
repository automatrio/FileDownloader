import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './pages/pages.module';
import { ApiService } from './common/services/api.service';
import { DataTransferService } from './common/services/data-transfer.service';
import { SpinnerService } from './common/services/spinner.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpCancellationInterceptor } from './common/interceptors/http-cancellation.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserInterfaceModule,
    BrowserAnimationsModule,
    PagesModule
  ],
  providers: [
    ApiService,
    DataTransferService,
    SpinnerService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpCancellationInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
