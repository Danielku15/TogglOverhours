import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
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

export interface ApiTimeEntryGroup {
  project_id: number | null;
  time_entries: ApiTimeEntry[];
}

export interface ApiTimeEntry {
  id: number;
  seconds: number;
  start: string;
  stop: string;
}

@Injectable({
  providedIn: 'root',
})
export class TogglApiService {
  async loadTimeEntriesPromise(
    workspaceId: number,
    togglApiToken: string,
    start: DateTime,
    end: DateTime
  ): Promise<ApiTimeEntryGroup[]> {
    const result: ApiTimeEntryGroup[] = [];

    let firstRowNumber = 1;

    while (true) {
      const loop = await firstValueFrom(this.client.post(`https://api.track.toggl.com/reports/api/v3/workspace/${workspaceId}/search/time_entries`, {
        start_date: start.toISODate(),
        end_date: end.plus({ days: 1 }).toISODate(),
        first_row_number: firstRowNumber
      },
        {
          headers: {
            authorization: 'Basic ' + btoa(`${togglApiToken}:api_token`),
          },

        })) as ApiTimeEntryGroup[];

      if (loop.length == 0) {
        // no more entries
        break;
      }

      result.push(...loop);

      firstRowNumber += loop.length;
    }

    return result;
  }

  constructor(private client: HttpClient) { }

  loadWorkspacesObservable(
    togglApiToken: string
  ): Observable<ApiTogglWorkspace[]> {
    return this.client.get(`https://api.track.toggl.com/api/v9/me/workspaces`, {
      headers: {
        authorization: 'Basic ' + btoa(`${togglApiToken}:api_token`),
      },
    }) as Observable<ApiTogglWorkspace[]>;
  }

  async loadProjectsPromise(
    workspaceId: number,
    togglApiToken: string
  ): Promise<ApiTogglProject[]> {
    return firstValueFrom(
      this.client.get(
        `https://api.track.toggl.com/api/v9/workspaces/${workspaceId}/projects`,
        {
          headers: {
            authorization: 'Basic ' + btoa(`${togglApiToken}:api_token`),
          },
        }
      ) as Observable<ApiTogglProject[]>
    );
  }
}
