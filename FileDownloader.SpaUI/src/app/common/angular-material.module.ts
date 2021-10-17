import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTreeModule,
    MatIconModule,
    OverlayModule,
    MatProgressBarModule
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatSliderModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTreeModule,
    MatIconModule,
    OverlayModule,
    MatProgressBarModule
  ]
})
export class AngularMaterialModule { }
