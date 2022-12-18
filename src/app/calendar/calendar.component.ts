import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';
import { DatabaseService } from '../database.service';
import { TimeTrackingPeriod } from '../model/database';

@Component({
  selector: 'to-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
 trackingPeriods$: Observable<TimeTrackingPeriod[]>;

  private _trackingPeriod?: TimeTrackingPeriod;
  get trackingPeriod(): TimeTrackingPeriod | undefined {
    return this._trackingPeriod;
  }
  set trackingPeriod(trackingPeriod: TimeTrackingPeriod | undefined) {
    this._trackingPeriod = trackingPeriod;
  }

  public months:DateTime[] = CalendarComponent.generateMonths()

  constructor(private database: DatabaseService) {
    this.trackingPeriods$ = database.database$.pipe(
      map((db) => db!.trackingPeriods)
    );
  }

  static generateMonths(): DateTime[] {
    const m:DateTime[] = [];
    const year = DateTime.now().year;
    for(let i = 0; i < 12; i++) {
      m.push(DateTime.fromObject({
        year: year,
        month: 1,
        day: 1
      }));
    }
    return m;
  }
  
}
