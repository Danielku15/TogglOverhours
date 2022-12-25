import { Component, Input } from '@angular/core';
import { TrackingPeriodStatistics } from '../model/work-statistics';

@Component({
  selector: 'to-year-details',
  templateUrl: './year-details.component.html',
  styleUrls: ['./year-details.component.scss']
})
export class YearDetailsComponent {
  @Input() trackingPeriod!: TrackingPeriodStatistics;
}
