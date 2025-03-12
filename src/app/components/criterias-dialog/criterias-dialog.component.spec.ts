import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriasDialogComponent } from './criterias-dialog.component';

describe('CriteriasDialogComponent', () => {
  let component: CriteriasDialogComponent;
  let fixture: ComponentFixture<CriteriasDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriasDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CriteriasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
