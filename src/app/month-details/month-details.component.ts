import { Component, Input } from '@angular/core';
import { MonthStatistics } from '../model/work-statistics';

@Component({
  selector: 'to-month-details',
  templateUrl: './month-details.component.html',
  styleUrls: ['./month-details.component.scss']
})
export class MonthDetailsComponent {
  @Input() month!: MonthStatistics;
}
