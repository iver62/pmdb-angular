import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeupArtistsComponent } from './makeup-artists.component';

describe('MakeupArtistsComponent', () => {
  let component: MakeupArtistsComponent;
  let fixture: ComponentFixture<MakeupArtistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeupArtistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeupArtistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
