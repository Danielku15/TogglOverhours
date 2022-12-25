import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { IFileSystemService, TestFileSystemService } from './core/services/file-system.service';
import { DatabaseService } from './core/services/database.service';
import { DatabaseModule } from './database/database.module';
import { ReportingModule } from './reporting/reporting.module';
import { SettingsModule } from './settings/settings.module';

function initializeApp(service: DatabaseService) {
  return () => service.reopen();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,

    CoreModule,
    SharedModule,
    DatabaseModule,
    ReportingModule,
    SettingsModule
  ],
  providers: [
    // {provide: IFileSystemService, useClass: BrowserFileSystemService},
    { provide: IFileSystemService, useClass: TestFileSystemService },
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [DatabaseService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab)
  }
}
