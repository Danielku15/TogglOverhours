import { Component, Input } from '@angular/core';
import { WeekdayPercentage } from '@app/core/models/database';

@Component({
  selector: 'to-weekday-percentage',
  templateUrl: './weekday-percentage.component.html',
  styleUrls: ['./weekday-percentage.component.scss'],
})
export class WeekdayPercentageComponent {
  @Input() percentages!: WeekdayPercentage;
}
