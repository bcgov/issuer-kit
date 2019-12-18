import { TestBed } from '@angular/core/testing';

import { TypeaheadService } from './typeahead.service';

describe('TypeaheadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypeaheadService = TestBed.get(TypeaheadService);
    expect(service).toBeTruthy();
  });
});
