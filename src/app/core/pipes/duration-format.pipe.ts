import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'luxon';

@Pipe({
  name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {

  transform(value: Duration | undefined, of?: Duration): unknown {
    if (of) {
      return `${this.formatDuration(value)} of ${this.formatDuration(of)}`
    }
    return this.formatDuration(value)
  }

  formatDuration(value: Duration | undefined) {
    if(!value) {
      return '(unset)';
    }
    return (value.valueOf() < 0 ? '-' + value.negate().toFormat('hh:mm') : value.toFormat('hh:mm')) + 'h'
  }
}
