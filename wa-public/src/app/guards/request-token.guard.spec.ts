import { TestBed, async, inject } from '@angular/core/testing';

import { RequestTokenGuard } from './request-token.guard';

describe('RequestTokenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestTokenGuard]
    });
  });

  it('should ...', inject([RequestTokenGuard], (guard: RequestTokenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
