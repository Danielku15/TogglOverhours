import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TogglDatabaseFilePickerOptions } from './model/commons';
import { Database, PasswordEncryptingJsonSerializationContext } from './model/database';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _password: string = '';
  private _handle?: FileSystemFileHandle;

  public database$: BehaviorSubject<Database | undefined> = new BehaviorSubject<Database | undefined>(undefined);

  constructor() { }

  async open(handle: FileSystemFileHandle, password: string) {
    const fileData = await handle.getFile();
    let json;
    try {
      json = JSON.parse(await fileData.text());
    } catch (e) {
      throw new Error('Failed to decode database: ' + e)
    }

    const database = new Database();
    database.fromJSON(json, new PasswordEncryptingJsonSerializationContext(password));
    this.database$.next(database);
    this._handle = handle;
    this._password = password;
  }

  async save() {
    if (!this._handle) {
      this._handle = await window.showSaveFilePicker({
        ...TogglDatabaseFilePickerOptions,
        suggestedName: 'TogglOverhours.todb'
      });
      if (!this._handle) {
        alert('Saving failed');
        return;
      }
    }

    const db = this.database$.value;
    if (!db || !this._handle) {
      return;
    }

    db.writeToFile(this._handle!, new PasswordEncryptingJsonSerializationContext(this._password));
  }
}
