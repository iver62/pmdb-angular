import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechniciansEditionComponent } from './technicians-form.component';

describe('TechniciansEditionComponent', () => {
  let component: TechniciansEditionComponent;
  let fixture: ComponentFixture<TechniciansEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechniciansEditionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TechniciansEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
