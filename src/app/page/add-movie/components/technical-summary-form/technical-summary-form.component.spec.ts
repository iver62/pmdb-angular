import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSummaryFormComponent } from './technical-summary-form.component';

describe('TechnicalSummaryFormComponent', () => {
  let component: TechnicalSummaryFormComponent;
  let fixture: ComponentFixture<TechnicalSummaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSummaryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSummaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
