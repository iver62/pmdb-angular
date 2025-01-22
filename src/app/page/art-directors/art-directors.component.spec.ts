import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtDirectorsComponent } from './art-directors.component';

describe('ArtDirectorsComponent', () => {
  let component: ArtDirectorsComponent;
  let fixture: ComponentFixture<ArtDirectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtDirectorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtDirectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
