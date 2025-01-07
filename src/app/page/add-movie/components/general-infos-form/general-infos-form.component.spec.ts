import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralInfosFormComponent } from './general-infos-form.component';

describe('GeneralInfosFormComponent', () => {
  let component: GeneralInfosFormComponent;
  let fixture: ComponentFixture<GeneralInfosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralInfosFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GeneralInfosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
