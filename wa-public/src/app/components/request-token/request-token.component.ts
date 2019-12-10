import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionService } from 'src/app/services/action.service';
import { StateService } from 'src/app/services/state.service';
import { FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'wap-request-token',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Request Token</ion-title>
      </ion-toolbar>
    </ion-header>
    <wap-view-wrapper>
      <mat-card>
        <mat-card-header class="main-header" *ngIf="!sent; else isSent">
          <img mat-card-avatar src="assets/VON-Logo.png" alt="VON Network logo" class="header-image" />
          <mat-card-title>Request Token</mat-card-title>
          <mat-card-subtitle
            >Your token has expired. To continue using the Identity Kit Proof of Concept(POC) please request a new token
            below. We've entered the email address that was originally signed up for the POC. If you'd like to use a
            different address to receive your new invite please enter it here.</mat-card-subtitle
          >
        </mat-card-header>

        <mat-card-content *ngIf="!sent">
          <wap-input
            [fc]="fc"
            [invalid]="fc.touched && fc.invalid"
            error="Please enter a valid email address"
            label="Email Address"
          >
          </wap-input>
        </mat-card-content>
        <mat-card-actions *ngIf="!sent">
          <button mat-raised-button (click)="decline()" color="warn">
            No Thanks
          </button>
          <button mat-raised-button (click)="submit(fc)" [disabled]="fc.invalid" color="primary">
            Request
          </button>
        </mat-card-actions>
      </mat-card>
    </wap-view-wrapper>
    <ng-template #isSent>
      <mat-card-header class="main-header">
        <img mat-card-avatar src="assets/VON-Logo.png" alt="VON Network logo" class="header-image" />
        <mat-card-title>Request sent</mat-card-title>
        <mat-card-subtitle
          >We have submitted your request for a new token. Please check your email for a new token.</mat-card-subtitle
        >
      </mat-card-header>
    </ng-template>
  `,
  styleUrls: ['./request-token.component.scss'],
})
export class RequestTokenComponent implements OnInit {
  fc: FormControl;
  sent = false;
  constructor(
    private router: Router,
    private actionSvc: ActionService,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private stateSvc: StateService,
  ) {
    const email = this.stateSvc.email || '';
    const fc = new FormControl(email, [Validators.required, Validators.email]);
    this.fc = fc;
  }

  ngOnInit() {}

  async submit(fc: FormControl) {
    console.log('submit clicked');
    const email = fc.value;
    const id = this.route.snapshot.paramMap.get('id');
    const load = await this.loadingCtrl.create({ message: 'Sending request', duration: 10000 });
    await load.present();
    try {
      const res = await this.actionSvc.requestRenewal({ email, id }).toPromise();

      await load.dismiss();
      this.sent = true;
    } catch (err) {
      console.log(err);
      await load.dismiss();
    }
  }

  decline() {
    console.log('decline clicked');
    this.router.navigate(['']);
  }
}
