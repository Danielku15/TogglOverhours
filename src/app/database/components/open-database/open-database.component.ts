import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TogglDatabaseFilePickerOptions } from '@app/core/constants/file-picker';
import { DatabaseService } from '@app/core/services/database.service';
import { IFileSystemService, IFileSystemFileHandle } from '@app/core/services/file-system.service';

@Component({
  selector: 'to-open-database',
  templateUrl: './open-database.component.html',
  styleUrls: ['./open-database.component.scss']
})
export class OpenDatabaseComponent {
  constructor(
    private database: DatabaseService,
    private filesystem: IFileSystemService,
    private router: Router
  ) { }

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
      this.router.navigate(['/reporting']);
    } catch (e) {
      this.databasePasswordError = e instanceof Error ? e.message : String(e);
    }
  }
}
