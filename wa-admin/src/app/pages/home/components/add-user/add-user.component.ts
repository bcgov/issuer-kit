import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action.service';
import { StateService } from 'src/app/services/state.service';
import { LoadingService } from 'src/app/services/loading.service';

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
      <mat-card> </mat-card>
    </ng-template>
  `,
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  title = 'Add user';
  fg: FormGroup;
  index = 0;
  invalid: boolean;

  get nextLabel() {
    return !this.index ? 'Next' : 'Submit';
  }

  constructor(
    private actionSvc: ActionService,
    private stateSvc: StateService,
    private loadingSvc: LoadingService
  ) {
    this.fg = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.email
      ]),
      method: new FormControl(null, [Validators.required]),
      jurisdiction: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {}

  submit(fg) {
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
      const response = this.actionSvc.createInvitation({
        method,
        jurisdiction,
        email
      });
    }
  }
}
