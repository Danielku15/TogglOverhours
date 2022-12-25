import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasDatabaseOpenedGuard } from '@app/core/guards/has-database-opened.guard';
import { SettingsOverviewComponent } from './components/settings-overview/settings-overview.component';
import { TrackingPeriodComponent } from './components/tracking-period/tracking-period.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '', 
    component: SettingsComponent,
    canActivate: [HasDatabaseOpenedGuard],
    children: [
      {
        path: 'overview',
        component: SettingsOverviewComponent,
        title: 'Settings',
      },
      {
        path: 'tracking-period/:id',
        component: TrackingPeriodComponent,
        title: 'Tracking Period',
      },
      {
        path: '**',
        redirectTo: 'overview'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
