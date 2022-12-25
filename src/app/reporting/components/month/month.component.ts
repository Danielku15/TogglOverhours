import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DatabaseService } from '@app/core/services/database.service';
import { TogglApiService } from '@app/core/services/toggl-api.service';
import { MonthStatistics } from '@app/reporting/models/work-statistics';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
