import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeRange } from '@app/reporting/models/time-range';
import { TrackingPeriodStatistics } from '@app/reporting/models/work-statistics';

@Component({
  selector: 'to-year-details',
  templateUrl: './year-details.component.html',
  styleUrls: ['./year-details.component.scss']
})
export class YearDetailsComponent {
  @Input() trackingPeriod!: TrackingPeriodStatistics;
  @Output() onReloadTimeEntries: EventEmitter<TimeRange> = new EventEmitter<TimeRange>();
}
