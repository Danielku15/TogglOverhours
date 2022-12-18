import {
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseService } from '../database.service';
import { ProjectSettings, TimeTrackingPeriod } from '../model/database';
import { TogglApiService } from '../toggl-api.service';

@Component({
  selector: 'to-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  constructor(
    private database: DatabaseService,
    private togglApi: TogglApiService,
    private modalService: NgbModal
  ) {}

  @ViewChild('loadingProjects', { read: TemplateRef })
  loadingProjects!: TemplateRef<any>;

  async reloadProjects() {
    const dialog = this.modalService.open(this.loadingProjects);

    const projects = await this.togglApi.loadProjectsPromise(
      this.database.database$.value!.workspaceId,
      this.database.database$.value!.togglApiToken
    );

    this.database.importProjectsFromApi(projects);

    dialog.close();
  }

  addTrackingPeriod() {
    const period = new TimeTrackingPeriod();

    for(const p of this.database$!.value!.projects) {
      if(p.active && !p.deleted) {
        period.projectHours.set(p.id, new ProjectSettings());
      }
    }

    this.database$.value!.trackingPeriods.push(period);
  }

  deleteTrackingPeriod(period: TimeTrackingPeriod, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if(confirm('Are you sure you want to delete the tracking period?')) {
      const i = this.database$.value!.trackingPeriods.indexOf(period);
      if (i !== -1) {
        this.database$.value?.trackingPeriods.splice(i, 1);
      }
    }
  }

  saveDatabase() {
    this.database.save();
  }

  database$ = this.database.database$;
}
