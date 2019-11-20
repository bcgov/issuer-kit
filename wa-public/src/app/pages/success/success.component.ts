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
                >Invalid date of birth
              </ion-text></ion-note
            >
            <ion-item lines="none"
              ><p>
                Preview your verifiable credential.
              </p>
            </ion-item>
          </mat-card-content>
          <mat-card-content *ngIf="index === 4"
            ><wap-issue-preview [values]="previewData"></wap-issue-preview>
          </mat-card-content>
          <mat-card-content *ngIf="index === 5" class="qr-wrapper"
            ><img [src]="img" mat-card-img class="qr-code" />
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
  previewData: { key: string; value: any }[];
  invite: {
    '@type': string;
    '@id': string;
    serviceEndpoint: string;
    label: string;
    recipientKeys: string[];
  };
  img: string;

  setIndex(i: number) {
    const indexMap = [
      {
        cardTitle: 'Welcome to VON',
        cardSubtitle: 'Authenticated',
        nextLabel: 'Sign-up'
      },
      {
        cardTitle: 'Sign-up',
        cardSubtitle: 'Account information',
        nextLabel: 'Next'
      },
      {
        cardTitle: 'Sign-up',
        cardSubtitle: 'Address information',
        nextLabel: 'Next'
      },
      {
        cardTitle: 'Sign-up',
        cardSubtitle: 'Personal information',
        nextLabel: 'Preview'
      },
      {
        cardTitle: 'Preview Credential',
        cardSubtitle: 'Personal information',
        nextLabel: 'Submit'
      },
      {
        cardTitle: 'Connect',
        cardSubtitle: 'Connect your mobile agent',
        nextLabel: 'Submit'
      }
    ];
    this.cardTitle = indexMap[i].cardTitle;
    this.cardSubtitle = indexMap[i].cardSubtitle;
    this.nextLabel = indexMap[i].nextLabel;
    this.invalid = false;
    if (i === 4) {
      this.previewData = this.setPreview(this.fg);
    }

    this.index = i;
  }

  validateIndex(i: number, fg: FormGroup) {
    console.log('this has been run');
    if (i === 5) return this.setIndex(i);
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
    const initFc = (val: string) =>
      new FormControl(val, [Validators.required, Validators.minLength(4)]);

    const firstName = initFc(user.firstName || '');
    const lastName = initFc(user.lastName || '');
    const emailAddress = new FormControl(user.email || '', [
      Validators.required,
      Validators.minLength(4),
      Validators.email
    ]);

    const streetAddress = initFc('123 Fake Street');
    const locality = initFc('Victoria');
    const postalCode = new FormControl('A1A1A1', [
      Validators.required,
      postalCodeValidator()
    ]);

    const dateOfBirth = initFc('');

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
    this.$title = of(`Sign-up: ${user.firstName} ${user.lastName}`);

    const invite = {
      '@type': 'did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation',
      '@id': '65595c96-6881-470c-bb5e-50e1335c0ff6',
      serviceEndpoint: 'http://192.168.65.3:8050',
      label: 'Alice',
      recipientKeys: ['CfvGNENfc13D7GfdYZ4s64va5VwrD5XYyZ91khHnzcAZ']
    };
    const stringVal = JSON.stringify(invite);
    this.img = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${stringVal}`;

    this.setIndex(5);
  }

  setPreview(fg: FormGroup) {
    const values = fg.getRawValue();
    console.log(values);
    const map = [
      {
        key: 'Display Name',
        value: `${values['firstName']} ${values['lastName']}`
      },
      {
        key: 'Email Address',
        value: values['emailAddress']
      },
      {
        key: 'Street Address',
        value: values['streetAddress']
      },
      {
        key: 'Locality',
        value: values['locality']
      },
      {
        key: 'Postal Code',
        value: values['postalCode']
      },
      {
        key: 'Date of Birth',
        value: values['dateOfBirth']
      }
    ];

    return map;
  }
}
