import { Component, Input } from '@angular/core';
import { TrackingPeriodStatistics } from '@app/reporting/models/work-statistics';

@Component({
  selector: 'to-year-summary',
  templateUrl: './year-summary.component.html',
  styleUrls: ['./year-summary.component.scss']
})
export class YearSummaryComponent {
  @Input() trackingPeriod!: TrackingPeriodStatistics;
}
