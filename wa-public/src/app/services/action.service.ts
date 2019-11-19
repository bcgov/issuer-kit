import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  authenticate() {
    // TODO: @ES some authentication logic here
  }

  constructor(
    private keyCloakSvc: KeycloakService,
    private stateSvc: StateService
  ) {
    this.keyCloakSvc
      .loadUserProfile()
      .then((res: Keycloak.KeycloakProfile) => (this.stateSvc.user = res));
  }

  logout() {
    this.keyCloakSvc.logout();
  }
}
