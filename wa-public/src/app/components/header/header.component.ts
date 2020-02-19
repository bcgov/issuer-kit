import { Component, OnInit, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'wap-header',
  templateUrl: '../../../assets/components/header/header.component.html',
  styleUrls: ['../../../assets/components/header/header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() logoUrl: string;
  @Input() title: string;
  @Input() logoutUrl: string;

  isLoggedIn: boolean;

  constructor(private keycloakService: KeycloakService) {
    this.keycloakService
      .isLoggedIn()
      .then(isLoggedIn => (this.isLoggedIn = isLoggedIn));
  }

  ngOnInit() {}

  async logout() {
    return this.keycloakService.logout(this.logoutUrl || '');
  }
}
