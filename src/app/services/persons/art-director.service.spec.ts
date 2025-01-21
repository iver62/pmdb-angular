import { TestBed } from '@angular/core/testing';

import { ArtDirectorService } from './art-director.service';

describe('ArtDirectorService', () => {
  let service: ArtDirectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtDirectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
