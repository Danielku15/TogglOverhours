import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { DatabaseService } from '../database.service';
import { Database, TimeTrackingPeriod } from '../model/database';
import { TrackingPeriodStatistics } from '../model/work-statistics';

@Component({
  selector: 'to-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnDestroy {
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
