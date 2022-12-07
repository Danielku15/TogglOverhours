import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { Duration } from 'luxon';

@Directive({
  selector: '[toDurationInput]',
})
export class DurationInputDirective {
  private _Duration!: Duration;

  get Duration(): Duration {
    return this._Duration;
  }

  @Input('toDurationInput') set Duration(value: Duration) {
    this._Duration = value;
    this.element.nativeElement.value = value.toFormat("hh:mm");
  }

  @Output('toDurationInputChange') DurationChange: EventEmitter<Duration> =
    new EventEmitter<Duration>();

  constructor(private element: ElementRef<HTMLInputElement>) {
    element.nativeElement.onchange;
  }

  @HostListener('change', ['$event'])
  onDurationChanged(e: Event) {
    const text = (e.target as HTMLInputElement).value;
    const m = text.match(/([0-9]+):([0-9]+)/);
    if(m) {
      this.Duration = Duration.fromObject({ hours: Number(m[1]), minutes: Number(m[2]) });
      this.DurationChange.emit(this.Duration);
    }
  }
}
