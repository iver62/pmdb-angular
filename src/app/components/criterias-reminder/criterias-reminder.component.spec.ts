import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriasReminderComponent } from './criterias-reminder.component';

describe('CriteriasReminderComponent', () => {
  let component: CriteriasReminderComponent;
  let fixture: ComponentFixture<CriteriasReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriasReminderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriasReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
