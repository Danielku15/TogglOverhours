import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TogglDatabaseFilePickerOptions } from '@app/core/constants/file-picker';
import { Database, PasswordEncryptingJsonSerializationContext } from '@app/core/models/database';
import { IFileSystemService } from '@app/core/services/file-system.service';
import { ApiTogglWorkspace, TogglApiService } from '@app/core/services/toggl-api.service';
import { catchError, Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'to-create-database',
  templateUrl: './create-database.component.html',
  styleUrls: ['./create-database.component.scss']
})
export class CreateDatabaseComponent {
  private _togglApiToken: string = '';

  workspaceId?: number;
  workspaceError: string = '';

  togglApiTokenError: string = '';
  get togglApiToken(): string {
    return this._togglApiToken;
  }
  set togglApiToken(togglApiToken: string) {
    this._togglApiToken = togglApiToken;
    this.workspaces$ = this.togglApi
      .loadWorkspacesObservable(this.togglApiToken)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.togglApiTokenError = error.message;
          return [];
        })
      );
  }

  databasePassword: string = '';
  databasePasswordError: string = '';

  workspaces$: Observable<ApiTogglWorkspace[]> = new BehaviorSubject(
    new Array<ApiTogglWorkspace>()
  );

  public constructor(
    private router: Router,
    private togglApi: TogglApiService,
    private filesystem: IFileSystemService
  ) { }

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

    if (
      this.togglApiTokenError ||
      this.workspaceError ||
      this.databasePasswordError
    ) {
      return;
    }

    const handle = await this.filesystem.showSaveFilePicker(
      'TogglOverhours.todb',
      {
        ...TogglDatabaseFilePickerOptions,
        suggestedName: 'TogglOverhours.todb',
      }
    );

    if (handle) {
      const newDb = new Database();
      newDb.workspaceId = this.workspaceId!;
      newDb.togglApiToken = this.togglApiToken;
      const context = new PasswordEncryptingJsonSerializationContext(
        this.databasePassword
      );
      await newDb.writeToFile(handle, context);
      this.router.navigate(['../open']);
    }
  }
}
