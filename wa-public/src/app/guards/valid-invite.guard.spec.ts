import { TestBed, async, inject } from '@angular/core/testing';

import { ValidInviteGuard } from './valid-invite.guard';

describe('ValidInviteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidInviteGuard]
    });
  });

  it('should ...', inject([ValidInviteGuard], (guard: ValidInviteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
