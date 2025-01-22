import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairDressersComponent } from './hair-dressers.component';

describe('HairDressersComponent', () => {
  let component: HairDressersComponent;
  let fixture: ComponentFixture<HairDressersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairDressersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairDressersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
