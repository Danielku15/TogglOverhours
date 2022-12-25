import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearDetailsComponent } from './year-details.component';

describe('YearDetailsComponent', () => {
  let component: YearDetailsComponent;
  let fixture: ComponentFixture<YearDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
