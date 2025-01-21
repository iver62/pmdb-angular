import { TestBed } from '@angular/core/testing';

import { HairDresserService } from './hair-dresser.service';

describe('HairDresserService', () => {
  let service: HairDresserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HairDresserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
