import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { personServiceResolver } from './person-service.resolver';

describe('personServiceResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => personServiceResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
