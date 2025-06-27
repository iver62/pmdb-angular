import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeremonyAwardsFormComponent } from './ceremony-awards-form.component';

describe('CeremonyAwardsFormComponent', () => {
  let component: CeremonyAwardsFormComponent;
  let fixture: ComponentFixture<CeremonyAwardsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeremonyAwardsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeremonyAwardsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
