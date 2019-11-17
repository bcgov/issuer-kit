import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action.service';
import { StateService } from 'src/app/services/state.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';

const url = environment.publicUrl;

@Component({
  selector: 'waa-add-user',
  template: `
    <waa-item-header title="Invite"> </waa-item-header>
    <waa-view-wrapper>
      <mat-card [formGroup]="fg" *ngIf="index === 0; else preview">
        <ion-item>
          <ion-label position="stacked">Email Address</ion-label>
          <ion-input formControlName="email" placeholder="email@example.com">
          </ion-input>
          <ion-note
            *ngIf="
              (invalid && fg['controls'].email.invalid) ||
              (fg['controls'].email.touched && fg['controls'].email.invalid)
            "
          >
            <ion-text color="danger">Invalid username </ion-text></ion-note
          >
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Jurisdiction</ion-label>
          <ion-select
            required
            formControlName="jurisdiction"
            placeholder="Select a jurisdiction"
          >
            <ion-select-option>BC</ion-select-option>
          </ion-select>
          <ion-note
            *ngIf="
              (invalid && fg['controls'].jurisdiction.invalid) ||
              (fg['controls'].jurisdiction.touched &&
                fg['controls'].jurisdiction.invalid)
            "
          >
            <ion-text color="danger">Invalid jurisdiction </ion-text></ion-note
          >
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Authentication</ion-label>
          <ion-radio-group no-padding formControlName="method">
            <ion-item lines="none">
              <ion-radio value="github" slot="start"></ion-radio>
              <ion-icon name="logo-github"></ion-icon>
            </ion-item>
          </ion-radio-group>
          <ion-note
            *ngIf="
              (invalid && fg['controls'].method.invalid) ||
              (fg['controls'].method.touched && fg['controls'].method.invalid)
            "
          >
            <ion-text color="danger"
              >Invalid authentication
            </ion-text></ion-note
          >
        </ion-item>
      </mat-card>
      <ion-footer>
        <ion-toolbar color="primary">
          <ion-buttons slot="secondary" color="warning" *ngIf="this.index">
            <ion-button (click)="this.index = 0">
              <ion-label>Back</ion-label>
            </ion-button>
          </ion-buttons>
          <ion-buttons slot="primary">
            <ion-button (click)="submit(fg)">
              <ion-label>{{ nextLabel }}</ion-label>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </waa-view-wrapper>
    <ng-template #preview>
      <waa-add-user-preview
        [email]="fg.value['email']"
        link="{{ url }}new-link"
        state="unsubmitted"
        [fields]="fields"
      >
      </waa-add-user-preview>
    </ng-template>
  `,
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  title = 'Add user';
  fg: FormGroup;
  index = 0;
  invalid: boolean;
  url: string;

  get nextLabel() {
    return !this.index ? 'Next' : 'Submit';
  }

  get fields() {
    return [
      {
        key: 'method',
        value: this.fg.value['method']
      },
      {
        key: 'jurisdiction',
        value: this.fg.value['jurisdiction']
      },
      {
        key: 'expiry',
        value: new Date(new Date().getTime() + 150000).toDateString()
      },
      {
        key: 'created',
        value: new Date().toDateString()
      },
      {
        key: 'addedBy',
        value: this.stateSvc.user.email
      }
    ];
  }

  constructor(
    private actionSvc: ActionService,
    private stateSvc: StateService,
    private loadingSvc: LoadingService,
    private alertSvc: AlertService,
    private router: Router
  ) {
    this.setFg();
    this.url = url;
  }

  ngOnInit() {}

  setFg() {
    this.fg = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.email
      ]),
      method: new FormControl('', [Validators.required]),
      jurisdiction: new FormControl('', Validators.required)
    });
  }

  async submit(fg) {
    if (fg.invalid) {
      fg.markAsTouched();
      fg.updateValueAndValidity();
      console.log(fg);
      this.invalid = true;
      return (this.fg = fg);
    }

    const { method, jurisdiction, email } = this.fg.value;
    if (this.index === 0) {
      this.index = 1;
      console.log(this.index);
    } else {
      const response = await this.actionSvc.createInvitation({
        method,
        jurisdiction,
        email
      });
      console.log(response);
      const mapped = this.fields.map(itm => {
        const obj = new Object();
        obj[itm.key] = itm.value;
        return obj;
      });
      const addedBy = this.stateSvc.user.email;
      const record = {
        _id: 'asdfjwezx',
        active: false,
        changed: false,
        consumed: false,
        expiry: new Date(new Date().getTime() + 150000).getTime(),
        created: new Date().getTime(),
        method,
        jurisdiction,
        firstName: '',
        lastName: '',
        addedBy,
        ...response
      } as IInvitationRecord;
      this.actionSvc.invitedUsers.push(record);

      const res = await this.alertSvc.confirmBox({
        header: 'Invitation Sent!',
        message: 'Would you like to create another user?',
        decline: 'Home',
        confirm: 'Add another'
      });
      console.log(res);
      if (res) return this.resetState();
      return this.router.navigate(['/']);
    }
  }

  resetState() {
    this.setFg();
    this.index = 0;
  }
}
