import { HostListener, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ActivationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class HttpCancellationInterceptor implements HttpInterceptor {

  @HostListener("window:unload", ["$event"])
  cancelAllOperations() {
    this.pendingHTTPRequests$.next();
  }

  private pendingHTTPRequests$ = new Subject<void>();

  constructor(router: Router) {
    this.pendingHTTPRequests$.subscribe(() => {
      console.log("Unsubscribing...");
    })
    router.events.subscribe(event => {
      if(event instanceof ActivationEnd) {
        this.cancelPendingRequests();
      }
    })
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(
        takeUntil(
          this.onCancelPendingRequests()
        )
      );
  }

  // Cancel Pending HTTP calls
  public cancelPendingRequests() {
    this.pendingHTTPRequests$.next();
  }

  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }
}
