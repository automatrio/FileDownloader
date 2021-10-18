import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { AnimationHelper } from 'src/app/common/helpers/animation.helper';

@Component({
  selector: 'app-button-card',
  templateUrl: './button-card.component.html',
  styleUrls: ['./button-card.component.scss'],
})
export class ButtonCardComponent implements OnInit {

  private rotateCog: boolean;

  @Input() iconUrl: string;
  @Input() cardTitle: string;
  @Input() routerLink: string | null;

  @HostBinding("style.--initial-rotation") initialRotation: string = "0deg";
  @HostBinding("style.--final-rotation") finalRotation: string = "360deg";
  @HostBinding("style.--color") @Input() color: string;

  @ViewChild("cog", {static: true}) cog: ElementRef<HTMLImageElement>;

  constructor() { }

  ngOnInit(): void {
    // this.cog.nativeElement.animate([
    //   {transform: `rotate(-90deg)`},
    //   {transform: `rotate(0deg)`}
    // ], {
    //   duration: 600,
    //   easing: "ease-out"
    // })
  }

  public initializeDelta() {
    requestAnimationFrame(() => this.listenToTransformChange());
    this.rotateCog = true;
  }

  public terminateDelta() {
    this.rotateCog = false;
    const angle = AnimationHelper.getCurrentRotation(this.cog.nativeElement);
    if(angle) this.setRotation(angle);
  }




  private listenToTransformChange = () => {
    if(!this.rotateCog) return;
    this.cog.nativeElement.style.transform = getComputedStyle(this.cog.nativeElement).transform;
    requestAnimationFrame(() => this.listenToTransformChange());
  };

  private setRotation(angle: number) {
    if(angle > 360) {
      angle = angle % 360;
    }
    this.initialRotation = angle + "deg";
    this.finalRotation = angle + 360 + "deg";
  }

}
