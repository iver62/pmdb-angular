import { TestBed } from '@angular/core/testing';

import { ScreenwriterService } from './screenwriter.service';

describe('ScreenwriterService', () => {
  let service: ScreenwriterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenwriterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
