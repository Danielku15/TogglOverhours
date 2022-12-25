import { Component } from '@angular/core';
import { TimeTrackingPeriod } from '@app/core/models/database';
import { DatabaseService } from '@app/core/services/database.service';
import { TrackingPeriodStatistics } from '@app/reporting/models/work-statistics';
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

  constructor(database: DatabaseService) {
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
}
