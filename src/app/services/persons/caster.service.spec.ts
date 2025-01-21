import { TestBed } from '@angular/core/testing';

import { CasterService } from './caster.service';

describe('CasterService', () => {
  let service: CasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
