import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TimeRange } from '@app/reporting/models/time-range';
import { MonthStatistics } from '@app/reporting/models/work-statistics';

@Component({
  selector: 'to-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
})
export class MonthComponent {
  @Input() month!: MonthStatistics;

  @Output() onReloadTimeEntries: EventEmitter<TimeRange> = new EventEmitter<TimeRange>();

  async reloadTimeEntries() {
    const start = this.month.startOfMonth;
    const end = this.month.startOfMonth.endOf('month');
    this.onReloadTimeEntries.emit({ start, end });
  }
}
