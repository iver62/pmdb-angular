import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsMultiselectComponent } from './persons-multiselect.component';

describe('PersonsMultiselectComponent', () => {
  let component: PersonsMultiselectComponent;
  let fixture: ComponentFixture<PersonsMultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonsMultiselectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonsMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
