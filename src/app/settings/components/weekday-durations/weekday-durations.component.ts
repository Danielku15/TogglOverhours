import { Component, Input } from '@angular/core';
import { WeekdayDuration } from '@app/core/models/database';

@Component({
  selector: 'to-weekday-durations',
  templateUrl: './weekday-durations.component.html',
  styleUrls: ['./weekday-durations.component.scss'],
})
export class WeekdayDurationsComponent {
  @Input() durations!: WeekdayDuration;
}
