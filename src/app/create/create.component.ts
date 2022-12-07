import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { TogglDatabaseFilePickerOptions } from '../model/commons';
import { Database, PasswordEncryptingJsonSerializationContext, WorkspaceProject } from '../model/database';
import { TogglApiService, TogglWorkspace } from '../toggl-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'to-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  private _togglApiToken: string = '';

  workspaceId?: number;
  workspaceError: string = '';

  togglApiTokenError: string = '';
  get togglApiToken(): string {
    return this._togglApiToken;
  }
  set togglApiToken(togglApiToken: string) {
    this._togglApiToken = togglApiToken;
    this.workspaces$ = this.togglApi.loadWorkspacesObservable(this.togglApiToken).pipe(
      catchError((error: HttpErrorResponse) => {
        this.togglApiTokenError = error.message;
        return [];
      })
    )
  }

  databasePassword: string = '';
  databasePasswordError: string = '';

  workspaces$: Observable<TogglWorkspace[]> = new BehaviorSubject(new Array<TogglWorkspace>());

  public constructor(private router: Router, private togglApi: TogglApiService) { }

  async createDatabase() {
    if (!this.togglApiToken) {
      this.togglApiTokenError = 'Missing API Token';
    } else {
      this.togglApiTokenError = '';
    }

    if (!this.databasePassword) {
      this.databasePasswordError = 'Missing Password';
    } else {
      this.databasePasswordError = '';
    }

    if (!this.workspaceId) {
      this.workspaceError = 'No valid workspace selected';
    } else {
      this.workspaceError = '';
    }

    if (this.togglApiTokenError || this.workspaceError || this.databasePasswordError) {
      return;
    }

    const handle = await window.showSaveFilePicker({
      ...TogglDatabaseFilePickerOptions,
      suggestedName: 'TogglOverhours.todb'
    });

    if (handle) {
      const newDb = new Database();
      newDb.workspaceId = this.workspaceId!;
      newDb.togglApiToken = this.togglApiToken;

      const noProject = new WorkspaceProject();
      noProject.id = 0;
      noProject.name = '';
      newDb.projects.push(noProject);
      const context = new PasswordEncryptingJsonSerializationContext(this.databasePassword);
      await newDb.writeToFile(handle, context);
      this.router.navigate(['login']);
    }
  }
}

