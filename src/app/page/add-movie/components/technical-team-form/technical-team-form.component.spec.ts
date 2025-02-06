import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalTeamFormComponent } from './technical-team-form.component';

describe('TechnicalTeamFormComponent', () => {
  let component: TechnicalTeamFormComponent;
  let fixture: ComponentFixture<TechnicalTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalTeamFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TechnicalTeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
