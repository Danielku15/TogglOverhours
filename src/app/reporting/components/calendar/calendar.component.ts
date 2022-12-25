import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TimeTrackingPeriod } from '@app/core/models/database';
import { DatabaseService } from '@app/core/services/database.service';
import { ToastService } from '@app/core/services/toast.service';
import { TogglApiService } from '@app/core/services/toggl-api.service';
import { TimeRange } from '@app/reporting/models/time-range';
import { TrackingPeriodStatistics } from '@app/reporting/models/work-statistics';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable, map } from 'rxjs';

@Component({
  selector: 'to-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  private databaseSubscription: Subscription;

  trackingPeriods$: Observable<TimeTrackingPeriod[]>;

  private _trackingPeriod?: TimeTrackingPeriod;
  get trackingPeriod(): TimeTrackingPeriod | undefined {
    return this._trackingPeriod;
  }
  set trackingPeriod(trackingPeriod: TimeTrackingPeriod | undefined) {
    this._trackingPeriod = trackingPeriod;
    if (trackingPeriod) {
      this.trackingPeriodStatistics = new TrackingPeriodStatistics(trackingPeriod);
    }
    else {
      this.trackingPeriodStatistics = undefined;
    }
  }

  public trackingPeriodStatistics?: TrackingPeriodStatistics;

  @ViewChild('loadingTimeEntries', { read: TemplateRef }) loadingTimeEntries!: TemplateRef<any>;

  constructor(private database: DatabaseService,
    private modalService: NgbModal,
    private togglApi: TogglApiService,
    private toastService: ToastService,
  ) {
    this.databaseSubscription = database.database$.subscribe(db => {
      this.trackingPeriod = db?.trackingPeriods[0]
    })
    this.trackingPeriods$ = database.database$.pipe(
      map((db) => db!.trackingPeriods)
    );
  }

  ngOnDestroy(): void {
    this.databaseSubscription.unsubscribe();
  }


  async reloadTimeEntries(range: TimeRange) {
    const dialog = this.modalService.open(this.loadingTimeEntries);
    try {
      const entries = await this.togglApi.loadTimeEntriesPromise(
        this.database.database$.value!.workspaceId,
        this.database.database$.value!.togglApiToken,
        range.start,
        range.end
      );

      this.database.importTimeEntriesFromApi(entries, this.trackingPeriod!);
      await this.database.save();

      this.toastService.showSuccess({
        body: `Reloaded time entries`
      })

      this.trackingPeriodStatistics = new TrackingPeriodStatistics(this.trackingPeriod!);
    }
    catch (e) {
      this.toastService.showError({
        body: `Failed to load time entries: ${e}`
      })
    }
    finally {
      dialog.close();
    }
  }
}
