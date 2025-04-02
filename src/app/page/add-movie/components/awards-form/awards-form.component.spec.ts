import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsFormComponent } from './awards-form.component';

describe('AwardsFormComponent', () => {
  let component: AwardsFormComponent;
  let fixture: ComponentFixture<AwardsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
