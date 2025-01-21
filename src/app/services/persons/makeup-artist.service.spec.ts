import { TestBed } from '@angular/core/testing';

import { MakeupArtistService } from './makeup-artist.service';

describe('MakeupArtistService', () => {
  let service: MakeupArtistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakeupArtistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
