import { Component, OnInit, Input } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'wap-header',
  template: `
    <ion-header>
      <ion-toolbar color="primary">

        <ion-title>
          <img class="branding-logo" src="/assets/bcgov/bcid-logo-rev-en.svg" width="181" height="44" alt="B.C. Government Logo">
          <span>{{ title }}</span>
        </ion-title>

        <ion-buttons slot="primary" *ngIf="isLoggedIn">
          <ion-button (click)="logout()">
            <ion-label>Log Out</ion-label>
            &nbsp;
            <ion-icon name="log-out"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
  styleUrls: ['./header.component.scss'],
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
