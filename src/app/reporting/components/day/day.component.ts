import { Component, Input } from '@angular/core';
import { DayStatistics } from '@app/reporting/models/work-statistics';

@Component({
  selector: 'to-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent {
  @Input() day!: DayStatistics;
}
