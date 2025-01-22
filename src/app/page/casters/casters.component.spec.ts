import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastersComponent } from './casters.component';

describe('CastersComponent', () => {
  let component: CastersComponent;
  let fixture: ComponentFixture<CastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CastersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
