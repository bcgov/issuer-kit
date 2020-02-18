import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StateService, IValidateLink } from 'src/app/services/state.service';
import { ActionService } from 'src/app/services/action.service';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'wap-accept-disclaimer',
  template: `
    <wap-header></wap-header>

    <wap-view-wrapper *ngIf="hasId; else noIdHelper">
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>Pre-Release Pilot</ion-card-subtitle>
          <ion-card-title>End User Agreement</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-textarea>
            <wap-terms-and-conditions></wap-terms-and-conditions>
          </ion-textarea>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-content>
          <ion-item lines="none">
            <ion-label><ion-text class="ion-text-wrap">I agree to the above terms of service.</ion-text></ion-label>
            <ion-checkbox slot="start" (click)="accepted = !accepted"></ion-checkbox>
          </ion-item>
          <ion-grid>
            <ion-row>
              <ion-col class="ion-align-self-start">
                <ion-button (click)="decline()" (click)="decline()" color="danger" size="default">Leave</ion-button>
              </ion-col>
              <ion-col class="ion-align-self-end">
                <ion-button (click)="submit()" [disabled]="!accepted" color="primary" size="default" class="float-right">Proceed</ion-button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

    </wap-view-wrapper>
    <ng-template #noIdHelper>
      <wap-view-wrapper>
        <mat-card>
          <mat-card-title>
            Please re-enter invitation link.
          </mat-card-title>
          <mat-card-content>
            Your session has expired. Please re-enter the link from the POC Invitation email.
          </mat-card-content>
        </mat-card>
      </wap-view-wrapper>
    </ng-template>
  `,
  styleUrls: ['./accept-disclaimer.component.scss'],
})
export class AcceptDisclaimerComponent implements OnInit {

  private termsOfService: string;

  hasId = true;
  accepted = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stateSvc: StateService,
    private keycloakService: KeycloakService
  ) {
  }

  async ngOnInit() {
    this.stateSvc._id = null;
    const token = this.route.snapshot.paramMap.get('id');
    try {
      const res = await this.stateSvc.isValidToken(token).toPromise();
      this.validateToken(res, token);
    } catch {
      console.log('no user profile');
    }
  }

  submit() {
    const loginOptions: Keycloak.KeycloakLoginOptions = {
      redirectUri: `${AppConfigService.settings.baseUrl}/success`
    };
    this.keycloakService.login(loginOptions);
  }

  decline() {
    this.router.navigate(['/']);
  }

  validateToken(obj: IValidateLink, token) {
    obj._id ? (this.stateSvc._id = obj._id) : (this.hasId = false);
    if (!obj.active) return this.router.navigate(['']);
    if (obj.expired) return this.router.navigate([`request/${token}`]);
  }

  get termsAndConditions(): string {
    return this.termsOfService;
  }
}
