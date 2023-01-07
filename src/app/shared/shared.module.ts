import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateInputDirective } from './directives/date-input.directive';
import { DurationInputDirective } from './directives/duration-input.directive';
import { ToastsComponent } from './components/toasts/toasts.component';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';
import { ProjectColorComponent } from './components/project-color/project-color.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    DateInputDirective,
    DurationInputDirective,
    ToastsComponent,
    LayoutComponent,
    ProjectColorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbToastModule
  ],
  exports: [
    DateInputDirective,
    DurationInputDirective,
    ToastsComponent,
    LayoutComponent,
    ProjectColorComponent
  ]
})
export class SharedModule { }
