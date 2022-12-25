import { Injectable } from '@angular/core';
import { DateTime, Duration } from 'luxon';
import { BehaviorSubject } from 'rxjs';
import { TogglDatabaseFilePickerOptions } from '../constants/file-picker';
import { Database, PasswordEncryptingJsonSerializationContext, WorkspaceProject, TimeTrackingPeriod, TimeTrackingEntry, ProjectSettings } from '../models/database';
import { IFileSystemFileHandle, IFileSystemService } from './file-system.service';
import { ApiTogglProject, ApiTimeEntryGroup } from './toggl-api.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private _password: string = '';
  private _handle?: IFileSystemFileHandle;

  public database$: BehaviorSubject<Database | undefined> = new BehaviorSubject<
    Database | undefined
  >(undefined);

  constructor(private filesystem: IFileSystemService) { }

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
    db.lastUpdate = DateTime.now();

    db.writeToFile(
      this._handle!,
      new PasswordEncryptingJsonSerializationContext(this._password)
    );
  }

  importProjectsFromApi(projects: ApiTogglProject[]) {
    projects = [...projects];
    const db = this.database$.value;
    if (!db) {
      return;
    }

    const existingLookup = new Map<number, WorkspaceProject>(db.projects);

    while (projects.length > 0) {
      const newProject = projects.pop()!;

      // get or create project in DB
      let existingProject = existingLookup.get(newProject.id);
      if (!existingProject) {
        existingProject = new WorkspaceProject();
        existingProject.id = newProject.id;
        db.projects.set(existingProject.id, existingProject);
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

    // update all time periods accordingly
    for(const period of db.trackingPeriods) {

      const existingProjects = [...period.projectHours.entries()];
      const newProjects = new Map<number, WorkspaceProject>(
        db.projects
      );

      for(const project of existingProjects) {
        if(!newProjects.has(project[0])) {
          period.projectHours.delete(project[0]);
        } else {
          newProjects.delete(project[0]);
        }
      } 

      for(const newProject of newProjects.entries()) {
        period.projectHours.set(newProject[0], new ProjectSettings())
      }
    }

    this.save();
  }

  importTimeEntriesFromApi(groups: ApiTimeEntryGroup[], trackingPeriod: TimeTrackingPeriod) {
    const database = this.database$.value!;

    const projectLookup = database.projects;
    const exisingEntries = new Map<number, TimeTrackingEntry>(trackingPeriod.timeEntries);

    for (const group of groups) {

      for (const entry of group.time_entries) {

        let existing = exisingEntries.get(entry.id);
        if (!existing) {
          existing = new TimeTrackingEntry();
          existing.id = entry.id;
          trackingPeriod.timeEntries.set(existing.id, existing);
        }

        existing.projectId = group.project_id !== null && projectLookup.has(group.project_id) ? group.project_id : undefined;
        existing.title = group.description;
        existing.start = DateTime.fromISO(entry.start);
        existing.end = DateTime.fromISO(entry.stop);
        existing.duration = Duration.fromObject({ seconds: entry.seconds });
      }
    }
  }
}
