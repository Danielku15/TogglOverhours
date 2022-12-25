import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasDatabaseOpenedGuard } from '@app/core/guards/has-database-opened.guard';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ReportingComponent } from './reporting.component';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    canActivate: [HasDatabaseOpenedGuard],
    children: [
      {
        path: 'calendar',
        component: CalendarComponent,
        title: 'Calendar'
      },
      {
        path: '**',
        redirectTo: 'calendar'
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
