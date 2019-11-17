import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action.service';
import { StateService } from 'src/app/services/state.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'waa-add-user',
  template: `
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content
      ><form [formGroup]="fg">
        <ion-item>
          <ion-label position="stacked">Email Address</ion-label>
          <ion-input formControlName="email" placeholder="email@example.com">
          </ion-input>
          <ion-note
            *ngIf="fg['controls'].email.touched && fg['controls'].email.invalid"
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
              fg['controls'].jurisdiction.touched &&
              fg['controls'].jurisdiction.invalid
            "
          >
            <ion-text color="danger">Invalid username </ion-text></ion-note
          >
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Authentication</ion-label>
          <ion-radio-group no-padding formControlName="method">
            <ion-item lines="none">
              <ion-icon name="logo-github"></ion-icon>
              <ion-label>Github</ion-label>
              <ion-radio value="github"></ion-radio>
            </ion-item>
          </ion-radio-group>
          <ion-note
            *ngIf="
              fg['controls'].method.touched && fg['controls'].method.invalid
            "
          >
            <ion-text color="danger">Invalid username </ion-text></ion-note
          >
        </ion-item>
      </form>
    </ion-content>
    <ion-footer>
      <ion-toolbar color="primary">
        <ion-buttons slot="secondary" color="warning">
          <ion-button click="reset()">
            <ion-icon slot="icon-only" name="trash"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button (click)="submit()">
            <ion-icon slot="icon-only" name="send"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `,
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  title = 'Add user';
  fg: FormGroup;
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

  submit() {
    if (this.fg.invalid) {
      console.log(this.fg);

      this.fg.markAsTouched();
      return this.fg.updateValueAndValidity();
    }

    console.log('valid');
    const { method, jurisdiction, email } = this.fg.value;

    const response = this.actionSvc.createInvitation({
      method,
      jurisdiction,
      email
    });
  }
}
