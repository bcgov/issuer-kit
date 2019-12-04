import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/services/action.service';
import { StateService } from 'src/app/services/state.service';
import { FormControl, Validators } from '@angular/forms';

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
        <mat-card-header class="main-header">
          <img mat-card-avatar src="assets/VON-Logo.png" alt="VON Network logo" class="header-image" />
          <mat-card-title>Request Token</mat-card-title>
          <mat-card-subtitle
            >Your token has expired. To continue using the Identity Kit Proof of Concept please request a new token
            below.</mat-card-subtitle
          >
        </mat-card-header>

        <mat-card-content>
          <wap-input
            [fc]="fc"
            [invalid]="fc.touched && fc.invalid"
            error="Please enter a valid email address"
            label="Email Address"
          >
          </wap-input>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button (click)="decline()" color="warn">
            No Thanks
          </button>
          <button mat-raised-button (click)="submit(fc)" [disabled]="fc.invalid" color="primary">
            Request
          </button>
        </mat-card-actions>
      </mat-card>
    </wap-view-wrapper>
  `,
  styleUrls: ['./request-token.component.scss'],
})
export class RequestTokenComponent implements OnInit {
  fc: FormControl;
  constructor(private router: Router, private actionSvc: ActionService, private stateSvc: StateService) {
    const fc = new FormControl('', [Validators.required, Validators.email]);
    this.fc = fc;
  }

  ngOnInit() {}

  submit(fc: FormControl) {
    console.log('submit clicked');
    const address = fc.value;
    console.log(address);
  }

  decline() {
    console.log('decline clicked');
    this.router.navigate(['']);
  }
}
