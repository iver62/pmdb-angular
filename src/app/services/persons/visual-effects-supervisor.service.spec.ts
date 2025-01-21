import { TestBed } from '@angular/core/testing';

import { VisualEffectSupervisorsService } from './visual-effects-supervisor.service';

describe('VisualEffectSupervisorsService', () => {
  let service: VisualEffectSupervisorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualEffectSupervisorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
