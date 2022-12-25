import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationFormatPipe } from './pipes/duration-format.pipe';

@NgModule({
  declarations: [
    DurationFormatPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DurationFormatPipe
  ]
})
export class CoreModule { }
