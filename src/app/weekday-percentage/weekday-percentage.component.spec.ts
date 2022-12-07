import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekdayPercentageComponent } from './weekday-percentage.component';

describe('WeekdayPercentageComponent', () => {
  let component: WeekdayPercentageComponent;
  let fixture: ComponentFixture<WeekdayPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekdayPercentageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekdayPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
