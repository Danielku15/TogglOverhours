import { Component, Input, OnInit } from '@angular/core';
import { WeekdayDuration as WeekdayDurations } from '../model/database';

@Component({
  selector: 'to-weekday-durations',
  templateUrl: './weekday-durations.component.html',
  styleUrls: ['./weekday-durations.component.scss'],
})
export class WeekdayDurationsComponent {
  @Input() durations!: WeekdayDurations;
}
