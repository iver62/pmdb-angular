import { TestBed } from '@angular/core/testing';
import { StuntmanService } from './stuntman.service';

describe('StuntmanService', () => {
  let service: StuntmanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StuntmanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
