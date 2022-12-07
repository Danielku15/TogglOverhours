import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { WorkspaceProject } from './model/database';

export interface TogglWorkspace {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TogglApiService {
  constructor(private client: HttpClient) { }

  loadWorkspacesObservable(togglApiToken: string): Observable<TogglWorkspace[]> {
    return this.client.get(`/api/v9/me/workspaces`, {
      headers: {
        authorization: "Basic " + btoa(`${togglApiToken}:api_token`)
      }
    }) as Observable<TogglWorkspace[]>;
  }


  async loadProjectsPromise(workspaceId: number, togglApiToken: string): Promise<WorkspaceProject[]> {
    return firstValueFrom(this.client.get(`/api/v9/workspaces/${workspaceId}/projects`, {
      headers: {
        authorization: "Basic " + btoa(`${togglApiToken}:api_token`)
      }
    }) as Observable<WorkspaceProject[]>);
  }
}