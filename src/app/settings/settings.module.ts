import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsOverviewComponent } from './components/settings-overview/settings-overview.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '@app/shared/shared.module';
import { TrackingPeriodComponent } from './components/tracking-period/tracking-period.component';
import { WeekdayDurationsComponent } from './components/weekday-durations/weekday-durations.component';
import { WeekdayPercentageComponent } from './components/weekday-percentage/weekday-percentage.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from '../settings/settings.component';

@NgModule({
  declarations: [
    SettingsOverviewComponent,
    TrackingPeriodComponent,
    WeekdayDurationsComponent,
    WeekdayPercentageComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    SettingsRoutingModule,
    SharedModule,
  ]
})
export class SettingsModule { }
