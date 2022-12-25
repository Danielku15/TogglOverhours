import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeRange } from '@app/reporting/models/time-range';
import { TrackingPeriodStatistics } from '@app/reporting/models/work-statistics';

@Component({
  selector: 'to-year-summary',
  templateUrl: './year-summary.component.html',
  styleUrls: ['./year-summary.component.scss'],
})
export class YearSummaryComponent {
  @Input() trackingPeriod!: TrackingPeriodStatistics;

  @Output() onReloadTimeEntries: EventEmitter<TimeRange> =
    new EventEmitter<TimeRange>();

  async reloadTimeEntries() {
    const start = this.trackingPeriod.period.start;
    const end = this.trackingPeriod.period.end;
    this.onReloadTimeEntries.emit({ start, end });
  }
}
