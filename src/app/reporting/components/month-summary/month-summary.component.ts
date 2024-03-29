import { Component, Input } from '@angular/core';
import { MonthStatistics } from '@app/reporting/models/work-statistics';

@Component({
  selector: 'to-month-summary',
  templateUrl: './month-summary.component.html',
  styleUrls: ['./month-summary.component.scss']
})
export class MonthSummaryComponent {
  @Input() month!: MonthStatistics;
}
