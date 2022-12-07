import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekdayDurationsComponent } from './weekday-durations.component';

describe('WeekdayDurationsComponent', () => {
  let component: WeekdayDurationsComponent;
  let fixture: ComponentFixture<WeekdayDurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekdayDurationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekdayDurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
