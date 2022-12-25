import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { DateTime } from 'luxon';

@Directive({
  selector: '[toDateInput]',
})
export class DateInputDirective {
  private _date!: DateTime;

  get date(): DateTime {
    return this._date;
  }

  @Input('toDateInput') set date(value: DateTime) {
    this._date = value;
    this.element.nativeElement.value = value.toISODate();
  }

  @Output('toDateInputChange') dateChange: EventEmitter<DateTime> =
    new EventEmitter<DateTime>();

  constructor(private element: ElementRef<HTMLInputElement>) {
    element.nativeElement.onchange;
  }

  @HostListener('change', ['$event'])
  onDateChanged(e: Event) {
    const text = (e.target as HTMLInputElement).value;
    console.log('Date changed', text);
    this.date = DateTime.fromISO(text);
    this.dateChange.emit(this.date);
  }
}
