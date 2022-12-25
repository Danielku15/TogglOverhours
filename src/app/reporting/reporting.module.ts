import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { MonthSummaryComponent } from './components/month-summary/month-summary.component';
import { MonthDetailsComponent } from './components/month-details/month-details.component';
import { YearSummaryComponent } from './components/year-summary/year-summary.component';
import { YearDetailsComponent } from './components/year-details/year-details.component';
import { MonthComponent } from './components/month/month.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from '../reporting/reporting.component';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@app/core/core.module';
import { DayComponent } from './components/day/day.component';
import { TimeEntryComponent } from './components/time-entry/time-entry.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CalendarComponent,

    MonthComponent,
    MonthDetailsComponent,
    MonthSummaryComponent,

    YearDetailsComponent,
    YearSummaryComponent,
    ReportingComponent,
    DayComponent,
    TimeEntryComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    ReportingRoutingModule,
    SharedModule
  ]
})
export class ReportingModule { }
