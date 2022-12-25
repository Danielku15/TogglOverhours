import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDatabaseComponent } from './components/create-database/create-database.component';
import { OpenDatabaseComponent } from './components/open-database/open-database.component';
import { FormsModule } from '@angular/forms';
import { DatabaseRoutingModule } from './database-routing.module';
import { DatabaseComponent } from '../database/database.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [
    CreateDatabaseComponent,
    OpenDatabaseComponent,
    DatabaseComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DatabaseRoutingModule
  ]
})
export class DatabaseModule { }
