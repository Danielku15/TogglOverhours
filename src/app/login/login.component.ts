import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import {
  IFileSystemFileHandle,
  IFileSystemService,
} from '../file-system.service';
import { TogglDatabaseFilePickerOptions } from '../model/commons';

@Component({
  selector: 'to-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private database: DatabaseService,
    private filesystem: IFileSystemService,
    private router: Router
  ) {}

  databaseFile?: IFileSystemFileHandle;
  databaseName: string = '';
  databasePassword: string = '';

  databaseFileError: string = '';
  databasePasswordError: string = '';

  async chooseDatabase() {
    const fileHandle = await this.filesystem.showOpenFilePicker(
      'TogglOverhours.todb',
      {
        ...TogglDatabaseFilePickerOptions,
        multiple: false,
      }
    );

    if (fileHandle) {
      this.databaseFile = fileHandle;
      this.databaseName = fileHandle.name;
    } else {
      this.databaseFile = undefined;
      this.databaseName = '';
    }
  }

  async openDatabase() {
    if (!this.databaseFile) {
      this.databaseFileError = 'No Database file selected';
    } else {
      this.databaseFileError = '';
    }

    if (!this.databasePassword) {
      this.databasePasswordError = 'Password missing';
    } else {
      this.databasePasswordError = '';
    }

    if (this.databaseFileError || this.databasePasswordError) {
      return;
    }

    try {
      await this.database.open(this.databaseFile!, this.databasePassword);
      this.router.navigate(['/app/calendar']);
    } catch (e) {
      this.databasePasswordError = e instanceof Error ? e.message : String(e);
    }
  }
}
