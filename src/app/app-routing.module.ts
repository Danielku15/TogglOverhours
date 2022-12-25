import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'database', loadChildren: () => import('./database/database.module').then(m => m.DatabaseModule) },
  { path: 'reporting', loadChildren: () => import('./reporting/reporting.module').then(m => m.ReportingModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: '', redirectTo: 'database', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
