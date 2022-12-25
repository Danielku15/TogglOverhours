import {
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseService } from '../database.service';
import { ProjectSettings, TimeTrackingPeriod } from '../model/database';
import { ToastService } from '../toast.service';
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
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  @ViewChild('loadingProjects', { read: TemplateRef })
  loadingProjects!: TemplateRef<any>;

  async reloadProjects() {
    const dialog = this.modalService.open(this.loadingProjects);
    try {
      const projects = await this.togglApi.loadProjectsPromise(
        this.database.database$.value!.workspaceId,
        this.database.database$.value!.togglApiToken
      );

      this.database.importProjectsFromApi(projects);

      this.toastService.showSuccess({
        body: `${projects.length} projects reloaded.`
      });
    }
    catch (e: any) {
      console.error(`Failed to reload projects`, e);
      this.toastService.showError({
        body: e.toString()
      });
    }
    finally {
      dialog.close();
    }
  }

  addTrackingPeriod() {
    const period = new TimeTrackingPeriod(this.database$.value!);

    for (const p of this.database$!.value!.projects) {
      if (p.active && !p.deleted) {
        period.projectHours.set(p.id, new ProjectSettings());
      }
    }

    this.database$.value!.trackingPeriods.push(period);
  }

  deleteTrackingPeriod(period: TimeTrackingPeriod, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('Are you sure you want to delete the tracking period?')) {
      const i = this.database$.value!.trackingPeriods.indexOf(period);
      if (i !== -1) {
        this.database$.value?.trackingPeriods.splice(i, 1);
      }
    }
  }

  saveDatabase() {
    try {
      this.database.save();
      this.toastService.showSuccess({
        body: `Database saved.`
      });
    }
    catch (e: any) {
      console.error(`Failed to save database`, e);
      this.toastService.showError({
        body: `Failed to save datbase: ${e}`
      });
    }
  }

  database$ = this.database.database$;
}
