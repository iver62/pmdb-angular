import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuntmenComponent } from './stuntmen.component';

describe('StuntmenComponent', () => {
  let component: StuntmenComponent;
  let fixture: ComponentFixture<StuntmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StuntmenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StuntmenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
