import { Component, OnInit } from '@angular/core';
import { StateService, IUser } from 'src/app/services/state.service';
import { ActionService } from 'src/app/services/action.service';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { postalCodeValidator } from 'src/app/services/validators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'wap-success',
  template: `
    <ion-header *ngIf="$title | async as title">
      <ion-toolbar color="primary">
        <ion-title> {{ title }}</ion-title>

        <ion-buttons slot="primary">
          <ion-button (click)="actionSvc.logout()">
            <ion-label>Logout</ion-label>
            <ion-icon name="log-out"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <wap-view-wrapper>
      <mat-card>
        <mat-card-header>
          <img
            mat-card-avatar
            src="assets/VON-Logo.png"
            alt="VON Network logo"
            class="header-image"
          />
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
                (invalid && fg.controls['emailAddress'].invalid) ||
                (fg.controls['emailAddress'].touched &&
                  fg.controls['emailAddress'].invalid)
              "
            >
            </wap-input>
          </mat-card-content>
          <mat-card-content *ngIf="index === 2" [formGroup]="fg">
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
              error="Postal code must be in the format of A1A1A1"
              [invalid]="
                (invalid && fg.controls['postalCode'].invalid) ||
                (fg.controls['postalCode'].touched &&
                  fg.controls['postalCode'].invalid)
              "
            >
            </wap-input>
          </mat-card-content>
          <mat-card-content *ngIf="index === 3" [formGroup]="fg">
            <ion-item>
              <ion-label position="stacked"
                >Date of Birth <ion-text color="danger">*</ion-text></ion-label
              >
              <ion-datetime
                formControlName="dateOfBirth"
                displayFormat="MMM DD YYYY"
                placeholder="MMM DD YYYY"
              ></ion-datetime>
            </ion-item>
            <ion-note
              *ngIf="
                (invalid && fg['controls'].dateOfBirth.invalid) ||
                (fg['controls'].dateOfBirth.touched &&
                  fg['controls'].dateOfBirth.invalid)
              "
            >
              <ion-text color="danger"
                >Invalid email address
              </ion-text></ion-note
            >
            <ion-item> </ion-item>
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

          <button mat-stroked-button (click)="validateIndex(index + 1, fg)">
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
  title = 'test';
  $title: Observable<string>;
  cardTitle = '';
  cardSubtitle = 'Sign-up for a verified credential';
  nextLabel = '';

  setIndex(i: number) {
    const indexMap = [
      {
        cardTitle: 'Welcome to VON',
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
        nextLabel: 'Next'
      },
      {
        cardTitle: 'Personal',
        cardSubtitle: 'Personal information',
        nextLabel: 'Preview'
      }
    ];
    this.cardTitle = indexMap[i].cardTitle;
    this.cardSubtitle = indexMap[i].cardSubtitle;
    this.nextLabel = indexMap[i].nextLabel;
    this.invalid = false;
    this.index = i;
  }

  validateIndex(i: number, fg: FormGroup) {
    const ctrls = fg.controls;

    function validFc(fc: AbstractControl) {
      return fc.valid;
    }
    const indexOneCtrls = [
      ctrls['firstName'],
      ctrls['lastName'],
      ctrls['emailAddress']
    ];
    const indexTwoCtrls = [
      ctrls['streetAddress'],
      ctrls['postalCode'],
      ctrls['locality']
    ];
    const indexThreeCtrls = [ctrls['dateOfBirth']];

    const ctrlMap = [indexOneCtrls, indexTwoCtrls, indexThreeCtrls];

    const indexValid = (args: { ctrls: AbstractControl[] }) => {
      const { ctrls } = args;
      const valids = ctrls.some(ctrl => validFc(ctrl));
      return valids;
    };
    const valid = indexValid({ ctrls: ctrlMap[i - 2] });
    return valid ? this.setIndex(i) : (this.invalid = true);
  }

  constructor(
    private stateSvc: StateService,
    public actionSvc: ActionService
  ) {}

  ngOnInit() {
    const user = this.stateSvc.user;
    console.log(user);
    const initFc = (val: string) =>
      new FormControl(val, [Validators.required, Validators.minLength(4)]);

    const firstName = initFc(user.firstName || '');
    const lastName = initFc(user.lastName || '');
    const emailAddress = new FormControl(user.email || '', [
      Validators.required,
      Validators.minLength(4),
      Validators.email
    ]);

    const streetAddress = initFc('');
    const locality = initFc('');
    const postalCode = new FormControl('', [
      Validators.required,
      postalCodeValidator()
    ]);

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

    this.fg.updateValueAndValidity();
    this.setIndex(1);
    this.$title = of(`Sign-up: ${user.firstName} ${user.lastName}`);
  }
}
