import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { WorkspaceProject } from './model/database';

export interface ApiTogglWorkspace {
  id: number;
  name: string;
}

export interface ApiTogglProject {
  id: number;
  name: string;
  active: boolean;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class TogglApiService {
  constructor(private client: HttpClient) { }

  loadWorkspacesObservable(togglApiToken: string): Observable<ApiTogglWorkspace[]> {
    return this.client.get(`https://api.track.toggl.com/api/v9/me/workspaces`, {
      headers: {
        authorization: "Basic " + btoa(`${togglApiToken}:api_token`)
      }
    }) as Observable<ApiTogglWorkspace[]>;
  }


  async loadProjectsPromise(workspaceId: number, togglApiToken: string): Promise<ApiTogglProject[]> {
    return firstValueFrom(this.client.get(`https://api.track.toggl.com/api/v9/workspaces/${workspaceId}/projects`, {
      headers: {
        authorization: "Basic " + btoa(`${togglApiToken}:api_token`)
      }
    }) as Observable<ApiTogglProject[]>);
  }
}