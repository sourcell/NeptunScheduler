import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingComponent } from './generating.component';

describe('GeneratingComponent', () => {
  let component: GeneratingComponent;
  let fixture: ComponentFixture<GeneratingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
