import { TestBed } from '@angular/core/testing';

import { CostumierService } from './costumier.service';

describe('CostumierService', () => {
  let service: CostumierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostumierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
