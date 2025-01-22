import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualEffectsSupervisorsComponent } from './visual-effects-supervisors.component';

describe('VisualEffectsSupervisorsComponent', () => {
  let component: VisualEffectsSupervisorsComponent;
  let fixture: ComponentFixture<VisualEffectsSupervisorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualEffectsSupervisorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualEffectsSupervisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
