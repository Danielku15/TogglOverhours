import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateInputDirective } from './directives/date-input.directive';
import { DurationInputDirective } from './directives/duration-input.directive';
import { ToastsComponent } from './components/toasts/toasts.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DateInputDirective,
    DurationInputDirective,
    ToastsComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  exports: [
    DateInputDirective,
    DurationInputDirective,
    ToastsComponent,
    LayoutComponent
  ]
})
export class SharedModule { }
