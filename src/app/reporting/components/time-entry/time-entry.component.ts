import { Component, Input } from '@angular/core';
import { TimeTrackingEntry } from '@app/core/models/database';
import { TimeEntryDetails } from '@app/reporting/models/work-statistics';

@Component({
  selector: 'to-time-entry',
  templateUrl: './time-entry.component.html',
  styleUrls: ['./time-entry.component.scss'],
})
export class TimeEntryComponent {
  @Input() timeEntry!: TimeEntryDetails;

  public computeBadgeStyle(): object {
    return {
      background: this.timeEntry.project?.color ?? 'var(--bs-primary)',
      color: this.needsDarkText(this.timeEntry.project?.color)
        ? 'var(--bs-dark)'
        : 'var(--bs-light)',
    };
  }

  private needsDarkText(color: string | undefined): boolean {
    if (!color) {
      return false;
    }
    const [red, green, blue] = this.parseColor(color);
    return red * 0.299 + green * 0.587 + blue * 0.114 > 186;
  }

  private parseColor(input: string): [number, number, number] {
    if (input.charAt(0) == '#') {
      var collen = (input.length - 1) / 3;
      var fact = [17, 1, 0.062272][collen - 1];
      return [
        Math.round(parseInt(input.substr(1, collen), 16) * fact),
        Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
        Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact),
      ];
    } else
      return input
        .split('(')[1]
        .split(')')[0]
        .split(',')
        .map((x) => +x) as [number, number, number];
  }
}
