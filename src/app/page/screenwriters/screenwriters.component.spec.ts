import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenwritersComponent } from './screenwriters.component';

describe('ScreenwritersComponent', () => {
  let component: ScreenwritersComponent;
  let fixture: ComponentFixture<ScreenwritersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenwritersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenwritersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
