import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingPeriodComponent } from './tracking-period.component';

describe('TrackingPeriodComponent', () => {
  let component: TrackingPeriodComponent;
  let fixture: ComponentFixture<TrackingPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
