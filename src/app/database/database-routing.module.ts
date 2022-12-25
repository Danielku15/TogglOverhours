import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CreateDatabaseComponent } from './components/create-database/create-database.component';
import { OpenDatabaseComponent } from './components/open-database/open-database.component';
import { DatabaseComponent } from './database.component';

const routes: Routes = [
  {
    path: '',
    component: DatabaseComponent,
    children: [
      {
        path: 'open', component: OpenDatabaseComponent,
        title: 'Open Database'
      },
      {
        path: 'create', component: CreateDatabaseComponent,
        title: 'Create Database'
      },
      {
        path: 'about', component: AboutComponent,
        title: 'About toggl-overhours'
      },
      {
        path: '**',
        redirectTo: 'open'
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
export class DatabaseRoutingModule { }
