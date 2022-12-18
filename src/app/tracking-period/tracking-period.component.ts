import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, map, Observable, switchMap } from 'rxjs';
import { DatabaseService } from '../database.service';
import {
  Database,
  ProjectSettings,
  TimeTrackingPeriod,
} from '../model/database';
import { WorkspaceProject } from '../model/toggl';

class ProjectSettingsWithProject {
  public constructor(
    public settings: ProjectSettings,
    public project: WorkspaceProject | undefined
  ) {}
}

@Component({
  selector: 'to-tracking-period',
  templateUrl: './tracking-period.component.html',
  styleUrls: ['./tracking-period.component.scss'],
})
export class TrackingPeriodComponent implements OnInit {
  trackingPeriod$!: Observable<TimeTrackingPeriod | undefined>;
  projects$!: Observable<WorkspaceProject[]>;
  projectHours$!: Observable<ProjectSettingsWithProject[] | undefined>;

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trackingPeriod$ = combineLatest([
      this.route.paramMap,
      this.database.database$,
    ]).pipe(
      map(([params, database]) => {
        return database?.trackingPeriods.find((p) => p.id == params.get('id'));
      })
    );

    this.projects$ = this.database.database$.pipe(
      map((database) => database?.projects.filter(p => p.active && !p.deleted) ?? [])
    );

    this.projectHours$ = combineLatest([
      this.trackingPeriod$,
      this.projects$,
    ]).pipe(
      map(([trackingPeriod, projects]) => {
        if (!trackingPeriod) {
          return [];
        }

        return Array.from(trackingPeriod.projectHours.entries()).map(
          ([projectId, settings]) => {
            return new ProjectSettingsWithProject(
              settings,
              projects.find((p) => p.id == projectId)
            );
          }
        );
      })
    );
  }

  save(): void {
    this.router.navigate(['/app/settings']);
  }
}
