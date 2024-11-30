import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumiersComponent } from './costumiers.component';

describe('CostumiersComponent', () => {
  let component: CostumiersComponent;
  let fixture: ComponentFixture<CostumiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostumiersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostumiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
