import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeremonyAwardsComponent } from './ceremony-awards.component';

describe('CeremonyAwardsComponent', () => {
  let component: CeremonyAwardsComponent;
  let fixture: ComponentFixture<CeremonyAwardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeremonyAwardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeremonyAwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
