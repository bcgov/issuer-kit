import { Component, OnInit, OnDestroy } from '@angular/core';
import { StateService, IUser } from 'src/app/services/state.service';
import { ActionService } from 'src/app/services/action.service';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { postalCodeValidator } from 'src/app/services/validators';
import { Observable, of, interval,  Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { take, mergeMap } from 'rxjs/operators';

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
    <wap-view-wrapper *ngIf="hasId; else noIdHelper">
      <ion-grid *ngIf="index === 0">
        <ion-row>
          <ion-col>
            <mat-card class="form-card">
              <mat-card-header class="main-header">
                <img
                  mat-card-avatar
                  src="assets/VON-Logo.png"
                  alt="VON Network logo"
                  class="header-image"
                />
                <mat-card-title>BC Services Card</mat-card-title>
                <mat-card-subtitle>Attributes from your card</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content *ngIf="$previewData | async as previewData">
                <wap-issue-preview [values]="previewData"></wap-issue-preview>
              </mat-card-content>
            </mat-card>
          </ion-col>
          <ion-col>
            <mat-card class="form-card">
              <mat-card-header class="main-header">
                <img
                  mat-card-avatar
                  src="assets/VON-Logo.png"
                  alt="VON Network logo"
                  class="header-image"
                />
                <mat-card-title>Verified Claims Values</mat-card-title>
                <mat-card-subtitle>Validate claims</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content [formGroup]="fg">
                <ion-list>
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
                    [disabled]="true"
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
                    [disabled]="true"
                  >
                  </wap-input>
                  <wap-input
                    [fc]="fg.controls['emailAddress']"
                    placeholder="email@example.com"
                    label="Email"
                    error="Email address is required"
                    [invalid]="
                      (invalid && fg.controls['emailAddress'].invalid) ||
                      (fg.controls['emailAddress'].touched &&
                        fg.controls['emailAddress'].invalid)
                    "
                    [disabled]="true"
                  >
                  </wap-input>
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

                  <ion-item lines="none">
                    <ion-label position="stacked"
                      >Date of Birth
                      <ion-text color="danger">*</ion-text></ion-label
                    >
                    <!--
                    <ion-datetime
                      formControlName="dateOfBirth"
                      displayFormat="MMM DD YYYY"
                      placeholder="MMM DD YYYY"
                    ></ion-datetime>
                    -->
                    <mat-form-field appearance="none">
                      <input style="display: hidden;" 
                      matInput [matDatepicker]="picker" 
                      placeholder="Choose a date"
                      startView="multi-year"
                      formControlName="dateOfBirth"
                      (onFocus)="dobFocus = true" 
                      (onBlur)="dobFocus = false"
                      (change)="dobChange($event)"
                      (click)="dobFocus = true"
                      >
                      <mat-datepicker-toggle matSuffix [for]="picker" 
                     >
                      </mat-datepicker-toggle>
                      <mat-datepicker #picker startView="year" [startAt]="startAt"></mat-datepicker>
                    </mat-form-field>
                  </ion-item>
                  <div class="dp-border" style="border-style: solid;"
                  [ngClass]="
                  { 
                    'dp-border-warn': fg['controls'].dateOfBirth.touched && fg['controls'].dateOfBirth.invalid, 
                  'dp-border-valid': dobFocus && fg['controls'].dateOfBirth.valid,
                  'db-border-warn': dobFocus && fg['controls'].dateOfBirth.invalid,
                  'dp-border-focused':  dobFocus && fg['controls'].dateOfBirth.valid
                }
                  " 
                  
                  >
                  </div>
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
                  <ion-item lines="none">
                    <ion-label
                      ><ion-text class="ion-text-wrap"
                        >DISCLAIMER: lorem ipsum dolor sit amet...</ion-text
                      ></ion-label
                    >
                    <ion-checkbox
                      slot="start"
                      (click)="accepted = !accepted"
                    ></ion-checkbox>
                  </ion-item>
                </ion-list>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary" [disabled]="true">
                  Back
                </button>
                <button
                  mat-raised-button
                  color="primary"
                  (click)="setIndex(index + 1)"
                  [disabled]="formInvalid"
                >
                  Preview
                </button>
              </mat-card-actions>
            </mat-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <mat-card *ngIf="index === 1">
        <mat-card-header class="main-header">
          <img
            mat-card-avatar
            src="assets/VON-Logo.png"
            alt="VON Network logo"
            class="header-image"
          />
          <mat-card-title>{{ cardTitle }}</mat-card-title>
          <mat-card-subtitle>{{ cardSubtitle }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content
          class="qr-wrapper"
          *ngIf="$previewData | async as previewData"
          ><wap-issue-preview
            [values]="previewData"
            position="missionary"
          ></wap-issue-preview>
        </mat-card-content>
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="setIndex(index - 1)"
          >
            Back
          </button>
          <button
            mat-raised-button
            color="primary"
            (click)="setIndex(index + 1)"
          >
            Submit
          </button>
        </mat-card-actions>
      </mat-card>
      <mat-card *ngIf="index === 2">
        <mat-card-header class="main-header">
          <img
            mat-card-avatar
            src="assets/VON-Logo.png"
            alt="VON Network logo"
            class="header-image"
          />
          <mat-card-title>{{ cardTitle }}</mat-card-title>
          <mat-card-subtitle>{{ cardSubtitle }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="qr-wrapper"
          ><img [src]="img" mat-card-img class="qr-code" />
        </mat-card-content>
        <mat-card class="mat-elevation-z0">
          <mat-card-header>
            <mat-card-title>Connect Your Mobile Agent</mat-card-title>
            <mat-card-subtitle>
              Helper text on how you can do that or a link to somewhere you can
              get one.</mat-card-subtitle
            >
          </mat-card-header>
        </mat-card>
      </mat-card>
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
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, OnDestroy {
  index = 0;
  hasId = true;
  accepted = false;
  invalid = false;
  startAt = new Date(1980, 0, 1)
  cardTitle = '';
  cardSubtitle = 'Sign-up for a verified credential';
  nextLabel = '';
  invite: any;
  dobFocus: boolean;

  connectionId: string;
  get formInvalid() {
    return !this.accepted || this.fg.invalid;
  }
  user: IUser;
  fg: FormGroup;
  $title: Observable<string>;

  subs: Subscription[] = [];
  $previewData: Observable<{ key: string; value: any; label: string }[]>;
  img: string;
  disableList: string[];

  dobChange(event: any) {
    this.dobFocus = false;
  }

  setIndex(i: number) {
    const indexMap = [
      {
        cardTitle: 'Welcome to VON',
        cardSubtitle: 'Authenticated',
        nextLabel: 'Sign-up'
      },
      {
        cardTitle: 'Preview',
        cardSubtitle: 'Preview Claims',
        nextLabel: 'Submit'
      },
      {
        cardTitle: 'Connect',
        cardSubtitle: 'Establish a connection with your mobile agent',
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
    this.index = i;
    if (i === 0) this.accepted = false;
    if (i === 1) {
      this.$previewData = of(this.setPreview(this.fg));
    }
    if (i === 2) this.fakeConnection();
  }

  validateAllIndex() {
    const indexes = [0, 1, 2];
    for (const index of indexes) {
      const valid = this.validateIndex(index, this.fg);
      if (!valid) return false;
    }
    return true;
  }

  validateIndex(i: number, fg: FormGroup) {
    if (i === 5 || i === 1) return this.setIndex(i);
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
    const valid = indexValid({ ctrls: ctrlMap[i] });
    return valid ? this.setIndex(i) : (this.invalid = true);
  }

  constructor(
    private stateSvc: StateService,
    public actionSvc: ActionService,
    private router: Router
  ) {}

  async ngOnInit() {
    // if (!this.stateSvc._id) return this.hasId = false;
    const user = this.stateSvc.user;
    const keys = Object.keys(user);
    this.disableList = keys.filter(
      key => user[key] !== undefined || null || ''
    );

    if (!user) return;
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
    const postalCode = new FormControl('', [
      Validators.required,
      postalCodeValidator()
    ]);
    const locality = initFc('');


    const dateOfBirth = initFc('');

    this.fg = new FormGroup({
      firstName,
      lastName,
      emailAddress,
      streetAddress,
      postalCode,
      locality,
      dateOfBirth
    });

    this.fg.updateValueAndValidity();
    this.$title = of(`Issue Verified Person Digital ID`);

    const invitation = await this.actionSvc.getInvitation().toPromise();
    this.connectionId = invitation.connection_id;
    const stringVal = JSON.stringify(invitation.invitation);
    console.log(stringVal)
    const encoded = invitation.base
    console.log(encoded)
    this.invite = invitation.invitation as any;
    this.img = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chld=L|0&chl=${encoded}`;
    const previewData = of(this.setPreview(this.fg));
    this.$previewData = previewData;
    this.setIndex(0);


  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  setPreview(fg: FormGroup) {
    const values = fg.getRawValue();
    const map = [
      {
        label: 'First Name',
        key: 'firstName',
        value: values['firstName'] || ''
      },
      {
        label: 'Last Name',
        key: 'lastName',
        value: values['lastName'] || ''
      },
      {
        label: 'Email Address',
        key: 'emailAddress',
        value: values['emailAddress'] || 'not defined'
      },
      {
        label: 'Street Address',
        key: 'streetAddress',
        value: values['streetAddress'] || 'not defined'
      },
      {
        label: 'Postal Code',
        key: 'postalCode',
        value: values['postalCode'] || 'not defined'
      },
      {
        label: 'Locality',
        key: 'locality',
        value: values['locality'] || 'not defined'
      },
      {
        label: 'Date of Birth',
        key: 'dateOfBirth',
        value: values['dateOfBirth'] || 'not defined'
      }
    ];

    return map;
  }
  fakeConnection() {
    if (!this.stateSvc._id) return this.hasId = false;
    const form = this.fg.getRawValue();
    const timer = interval(7000);
    this.subs.push(
      timer
        .pipe(
          take(50),
          mergeMap(() => this.actionSvc.getConnectionState(this.connectionId))
        )
        .subscribe(obs => {
          console.log(JSON.stringify(this.invite, null, 2));
          if (obs.state === 'active') {
            this.actionSvc
              .issueCredentials({
                connectionId: this.connectionId,
                claims: {
                  userdisplayname: `${form.firstName} ${form.lastName}`,
                  stateorprovince: 'BC',
                  locality: form.locality,
                  email: form.emailAddress,
                  birthdate: form.dateOfBirth,
                  surname: form.lastName,
                  givenname: form.firstName,
                  streetaddress: form.streetAddress,
                  postalcode: form.postalCode,
                  country: 'CA'
                },
                _id: this.stateSvc._id,
              })
              .toPromise()
              .then(res => {
                this.router.navigate([
                  `/issue-credential/${res.credential_exchange_id}`
                ]);
              });
          }
        })
    );
  }
}
