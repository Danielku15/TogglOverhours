import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  IFileSystemFileHandle,
  IFileSystemService,
} from './file-system.service';
import { TogglDatabaseFilePickerOptions } from './model/commons';
import {
  Database,
  PasswordEncryptingJsonSerializationContext,
  WorkspaceProject,
} from './model/database';
import { ApiTogglProject } from './toggl-api.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _password: string = '';
  private _handle?: IFileSystemFileHandle;

  public database$: BehaviorSubject<Database | undefined> = new BehaviorSubject<
    Database | undefined
  >(undefined);

  constructor(private filesystem: IFileSystemService) {}

  async reopen() {
    const password = sessionStorage.getItem(
      'toggl-overhours.database.password'
    );
    const handle = await this.filesystem.constructHandle(
      sessionStorage.getItem('toggl-overhours.database.handle')
    );
    if (password && handle) {
      await this.open(handle, password);
    }
  }

  async open(handle: IFileSystemFileHandle, password: string) {
    let json;
    try {
      json = JSON.parse(await handle.loadText());
    } catch (e) {
      throw new Error('Failed to decode database: ' + e);
    }

    const database = new Database();
    database.fromJSON(
      json,
      new PasswordEncryptingJsonSerializationContext(password)
    );
    this.database$.next(database);

    this._handle = handle;
    this._password = password;

    sessionStorage.setItem('toggl-overhours.database.password', password);
    sessionStorage.setItem(
      'toggl-overhours.database.handle',
      handle.serialize()
    );
  }

  async save() {
    if (!this._handle) {
      this._handle = await this.filesystem.showSaveFilePicker(
        'TogglOverhours.todb',
        {
          ...TogglDatabaseFilePickerOptions,
          suggestedName: 'TogglOverhours.todb',
        }
      );
      if (!this._handle) {
        alert('Saving failed');
        return;
      }
    }

    const db = this.database$.value;
    if (!db || !this._handle) {
      return;
    }

    db.writeToFile(
      this._handle!,
      new PasswordEncryptingJsonSerializationContext(this._password)
    );
  }

  importProjectsFromApi(projects: ApiTogglProject[]) {
    const db = this.database$.value;
    if (!db) {
      return;
    }

    const existingLookup = new Map<number, WorkspaceProject>(
      db.projects.map((p) => [p.id, p])
    );

    while (projects.length > 0) {
      const newProject = projects.pop()!;

      // get or create project in DB
      let existingProject = existingLookup.get(newProject.id);
      if (!existingProject) {
        existingProject = new WorkspaceProject();
        db.projects.push(existingProject);
      }

      // update values
      existingProject.id = newProject.id;
      existingProject.active = newProject.active;
      existingProject.color = newProject.color;
      existingProject.name = newProject.name;

      // mark as handled
      existingLookup.delete(newProject.id);
    }

    // any remaining existing project which was not handled yet is now deleted
    for (const p of existingLookup.values()) {
      p.deleted = true;
    }

    this.save();
  }
}
