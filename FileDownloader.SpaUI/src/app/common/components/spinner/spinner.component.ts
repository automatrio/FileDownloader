import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  message: string;
  message$: Observable<string>;

  constructor() {}

  ngOnInit() {
    this.message$.subscribe(value => console.log(value));
  }

}
