import { TestBed, async, inject } from '@angular/core/testing';

import { KeycloakGuard } from './keycloak.guard';

describe('KeycloakGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeycloakGuard]
    });
  });

  it('should ...', inject([KeycloakGuard], (guard: KeycloakGuard) => {
    expect(guard).toBeTruthy();
  }));
});
