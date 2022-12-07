import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseService } from '../database.service';
import { TimeTrackingPeriod } from '../model/database';
import { TogglApiService } from '../toggl-api.service';

@Component({
  selector: 'to-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements AfterViewInit {
  constructor(private database: DatabaseService, private togglApi: TogglApiService, private modalService: NgbModal) {
  }

  @ViewChild('loadingProjects', { read: TemplateRef }) loadingProjects!: TemplateRef<any>

  ngAfterViewInit(): void {
    this.reloadProjects();
  }

  async reloadProjects() {
    const dialog = this.modalService.open(this.loadingProjects);

    const projects = await this.togglApi.loadProjectsPromise(this.database.database$.value!.workspaceId,
      this.database.database$.value!.togglApiToken);
    console.log(projects);
    
    dialog.close();
  }

  addTrackingPeriod() {
    const period = new TimeTrackingPeriod();
    this.database$.value!.trackingPeriods.push(period);
    this.database.save();
  }

  database$ = this.database.database$;
}
