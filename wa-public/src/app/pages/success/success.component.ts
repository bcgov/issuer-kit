import { Component, OnInit } from '@angular/core';
import { StateService, IUser } from 'src/app/services/state.service';
import { ActionService } from 'src/app/services/action.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'wap-success',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="secondary">
          <ion-button (click)="actionSvc.logout()">
            <ion-label>Logout</ion-label>
            <ion-icon name="log-out"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <wap-view-wrapper>
      <mat-card class="example-card">
        <img mat-card-image src="assets/VONLogo.png" alt="VON Network logo" />
        <mat-card-header>
          <mat-card-title>{{ cardTitle }}</mat-card-title>
          <mat-card-subtitle>{{ cardSubtitle }}</mat-card-subtitle>
        </mat-card-header>
        <ion-list>
          <mat-card-content *ngIf="index === 0"> </mat-card-content>
          <mat-card-content *ngIf="index === 1" [formGroup]="fg">
            <wap-input
              [fc]="fg.controls['firstName']"
              placeholder="John"
              label="First Name"
              error="First name is required"
              [invalid]="
                (invalid && fg.controls['firstName'].invalid) ||
                (fg.controls['firstName'].touched &&
                  fg.controls['firstName'].invalid)
              "
            >
            </wap-input>
            <wap-input
              [fc]="fg.controls['lastName']"
              placeholder="Doe"
              label="Last Name"
              error="Last name is required"
              [invalid]="
                (invalid && fg.controls['lastName'].invalid) ||
                (fg.controls['lastName'].touched &&
                  fg.controls['lastName'].invalid)
              "
            >
            </wap-input>
            <wap-input
              [fc]="fg.controls['emailAddress']"
              placeholder="email@example.com"
              label="Email Address"
              error="Email address is required"
              [invalid]="
                (invalid && fg.controls['lastName'].invalid) ||
                (fg.controls['lastName'].touched &&
                  fg.controls['lastName'].invalid)
              "
            >
            </wap-input>
            <ion-item>
              <ion-label>Date of Birth</ion-label>
              <ion-datetime displayFormat="MMM DD YYYY"></ion-datetime>
            </ion-item>
          </mat-card-content>
          <mat-card-content *ngIf="index === 2">
            <wap-input
              [fc]="fg.controls['streetAddress']"
              placeholder="123 Fake Street"
              label="Street Address"
              error="Street address is required"
              [invalid]="
                (invalid && fg.controls['streetAddress'].invalid) ||
                (fg.controls['streetAddress'].touched &&
                  fg.controls['streetAddress'].invalid)
              "
            >
            </wap-input>
            <wap-input
              [fc]="fg.controls['locality']"
              placeholder="Victoria"
              label="Locality"
              error="Locality is required"
              [invalid]="
                (invalid && fg.controls['locality'].invalid) ||
                (fg.controls['locality'].touched &&
                  fg.controls['locality'].invalid)
              "
            >
            </wap-input>
            <wap-input
              [fc]="fg.controls['postalCode']"
              placeholder="A1AA1A"
              label="Postal Code"
              error="Postal code is required"
              [invalid]="
                (invalid && fg.controls['locality'].invalid) ||
                (fg.controls['locality'].touched &&
                  fg.controls['locality'].invalid)
              "
            >
            </wap-input>
          </mat-card-content>
        </ion-list>
        <mat-card-actions>
          <button
            mat-stroked-button
            [disabled]="index === 0"
            (click)="setIndex(index - 1)"
          >
            Back
          </button>

          <button mat-stroked-button (click)="setIndex(index + 1)">
            {{ nextLabel }}
          </button>
        </mat-card-actions>
      </mat-card>
    </wap-view-wrapper>
  `,
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  index = 0;
  user: IUser;
  fg: FormGroup;
  invalid = false;
  title = '';
  cardTitle = '';
  cardSubtitle = 'Sign-up for a verified credential';
  nextLabel = '';

  setIndex(i: number) {
    const indexMap = [
      {
        cardTitle: 'Sign-up',
        cardSubtitle: 'Authenticated',
        nextLabel: 'Sign-up'
      },
      {
        cardTitle: 'Account',
        cardSubtitle: 'Account information',
        nextLabel: 'Next'
      },
      {
        cardTitle: 'Address',
        cardSubtitle: 'Address information',
        nextLabel: 'Submit'
      }
    ];
    this.cardTitle = indexMap[i].cardTitle;
    this.cardSubtitle = indexMap[i].cardSubtitle;
    this.nextLabel = indexMap[i].nextLabel;

    this.index = i;
  }

  constructor(
    private stateSvc: StateService,
    public actionSvc: ActionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.setIndex(2);
    const user = this.stateSvc.user;
    console.log(user);

    const initFc = (val: string) =>
      new FormControl(val, [Validators.required, Validators.minLength(4)]);

    const firstName = initFc(user.firstName || '');
    const lastName = initFc(user.lastName || '');
    const emailAddress = initFc(user.email || '');

    const streetAddress = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.email
    ]);
    const locality = initFc('');
    const postalCode = initFc('');

    const dateOfBirth = initFc('');
    /*
    const email = new FormControl(, [
      Validators.required,
      Validators.minLength(4),
      Validators.email
    ])
    */

    this.fg = new FormGroup({
      firstName,
      lastName,
      emailAddress,
      streetAddress,
      locality,
      postalCode,
      dateOfBirth
    });
  }
}
