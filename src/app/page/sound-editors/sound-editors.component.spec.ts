import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundEditorsComponent } from './sound-editors.component';

describe('SoundEditorsComponent', () => {
  let component: SoundEditorsComponent;
  let fixture: ComponentFixture<SoundEditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundEditorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundEditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
