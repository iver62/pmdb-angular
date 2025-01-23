import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { Person } from '../models';
import { personTypeResolver } from './person-type.resolver';

describe('personTypeResolver', () => {
  const executeResolver: ResolveFn<Person> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => personTypeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
