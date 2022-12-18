import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'to-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
})
export class MonthComponent {
  @Input() month!: DateTime;
}
