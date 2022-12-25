import {
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TimeTrackingPeriod, ProjectSettings } from '@app/core/models/database';
import { DatabaseService } from '@app/core/services/database.service';
import { ToastService } from '@app/core/services/toast.service';
import { TogglApiService } from '@app/core/services/toggl-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'to-settings-overview',
  templateUrl: './settings-overview.component.html',
  styleUrls: ['./settings-overview.component.scss']
})
export class SettingsOverviewComponent {
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

    for (const p of this.database$!.value!.projects.values()) {
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
