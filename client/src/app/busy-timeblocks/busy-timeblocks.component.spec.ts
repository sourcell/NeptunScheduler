import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusyTimeblocksComponent } from './busy-timeblocks.component';

describe('BusyTimeBlocksComponent', () => {
  let component: BusyTimeblocksComponent;
  let fixture: ComponentFixture<BusyTimeblocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusyTimeblocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusyTimeblocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
