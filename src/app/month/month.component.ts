import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { DatabaseService } from '../database.service';
import { MonthStatistics } from '../model/work-statistics';
import { TogglApiService } from '../toggl-api.service';

@Component({
  selector: 'to-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
})
export class MonthComponent {
  @Input() month!: MonthStatistics;

  @ViewChild('loadingTimeEntries', { read: TemplateRef })
  loadingTimeEntries!: TemplateRef<any>;

  public constructor(
    private database: DatabaseService,
    private modalService: NgbModal,
    private togglApi: TogglApiService
  ) { }

  async reloadTimeEntries() {
    const dialog = this.modalService.open(this.loadingTimeEntries);

    const start = this.month.startOfMonth;
    const end = this.month.startOfMonth.endOf('month');
    const entries = await this.togglApi.loadTimeEntriesPromise(
      this.database.database$.value!.workspaceId,
      this.database.database$.value!.togglApiToken,
      start,
      end
    );

    // this.database.importTimeEntriesFromApi(entries, this.trackingPeriod, start, end);

    dialog.close();
  }
}
