import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyActiveTimesComponent } from './daily-active-times.component';

describe('DailyActiveTimesComponent', () => {
  let component: DailyActiveTimesComponent;
  let fixture: ComponentFixture<DailyActiveTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyActiveTimesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyActiveTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
