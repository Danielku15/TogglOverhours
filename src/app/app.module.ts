import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from './settings/settings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TrackingPeriodComponent } from './tracking-period/tracking-period.component';
import { FormsModule } from '@angular/forms';
import { DateInputDirective } from './date-input.directive';
import { DurationInputDirective } from './duration-input.directive';
import { WeekdayDurationsComponent } from './weekday-durations/weekday-durations.component';
import { WeekdayPercentageComponent } from './weekday-percentage/weekday-percentage.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { CreateComponent } from './create/create.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    CalendarComponent,
    TrackingPeriodComponent,
    DateInputDirective,
    DurationInputDirective,
    WeekdayDurationsComponent,
    WeekdayPercentageComponent,
    LoginComponent,
    LayoutComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  public constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab)
  }

}
