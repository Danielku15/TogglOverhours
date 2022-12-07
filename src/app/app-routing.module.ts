import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { CreateComponent } from './create/create.component';
import { HasDatabaseOpenedGuardService } from './has-database-opened-guard.service';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { TrackingPeriodComponent } from './tracking-period/tracking-period.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateComponent },
  {
    path: 'app',
    canActivate: [HasDatabaseOpenedGuardService],
    component: LayoutComponent,
    children: [
      { path: 'calendar', component: CalendarComponent, title: 'Calendar' },
      {
        path: 'settings',
        component: SettingsComponent,
        title: 'Settings',
      },
      {
        path: 'tracking-period/:id',
        component: TrackingPeriodComponent,
        title: 'Tracking Period',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
