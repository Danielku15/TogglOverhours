import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { showOpenFilePicker } from 'file-system-access';
import { DatabaseService } from '../database.service';
import { TogglDatabaseFilePickerOptions } from '../model/commons';

@Component({
  selector: 'to-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private database: DatabaseService, private router: Router) {
  }

  databaseFile?: FileSystemFileHandle;
  databaseName: string = '';
  databasePassword: string = '';

  databaseFileError: string = '';
  databasePasswordError: string = '';

  async chooseDatabase() {
    const [fileHandle] = await showOpenFilePicker({
      ...TogglDatabaseFilePickerOptions,
      multiple: false
    });

    if (fileHandle?.kind === 'file') {
      this.databaseFile = fileHandle;
      this.databaseName = fileHandle.name;
    } else {
      this.databaseFile = undefined;
      this.databaseName = ''
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
      this.router.navigate(['/app/settings']);
    } catch (e) {
      this.databasePasswordError = (e instanceof Error) ? e.message : String(e);
    }
  }
}
