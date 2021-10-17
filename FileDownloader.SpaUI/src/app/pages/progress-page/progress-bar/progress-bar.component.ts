import { Component, Input, OnInit } from '@angular/core';
import { eStatus } from '../_enums/e-status.enum';
import { FileInfo } from '../_models/file-info.view-model';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  @Input() fileInfo: FileInfo;

  constructor() { }

  ngOnInit(): void {
  }

  public get status() { return <number> this.fileInfo.status; }

}
