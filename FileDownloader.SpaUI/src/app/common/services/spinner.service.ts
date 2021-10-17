import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private isLoading = new BehaviorSubject<boolean>(false);
  private spinnerRef: ComponentRef<SpinnerComponent>;
  private overlayRef: OverlayRef;
  private message: string;

  constructor(private overlay: Overlay) {
    this.isLoading.subscribe(isLoading => {
      if(isLoading) {
        this.createSpinner();
      }
      else if(this.spinnerRef) {
        this.spinnerRef.destroy();
        this.overlayRef.detachBackdrop();
      }
    })
  }

  public toggleLoading(message: string = "") {
    this.message = message;
    const currentValue = this.isLoading.getValue();
    this.isLoading.next(!currentValue);
  }

  public showSpinner() {
    const isShown = this.isLoading.getValue();
    if(isShown) return;
    this.isLoading.next(true);
  }

  public setObservableMessage(messageObs: Observable<string>) {
    this.spinnerRef.instance.message$ = messageObs;
  }

  public hideSpinner() {
    const isShown = this.isLoading.getValue();
    if(!isShown) return;
    this.isLoading.next(false);
  }

  private createSpinner() {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: "overlay-backdrop"
    });
    const portal = new ComponentPortal(SpinnerComponent);
    const componentRef = overlayRef.attach(portal);
    componentRef.instance.message = this.message;
    
    this.overlayRef = overlayRef;
    this.spinnerRef = componentRef;
  }
}
