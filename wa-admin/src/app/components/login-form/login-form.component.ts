import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/services/action.service';
import { StateService } from 'src/app/services/state.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'waa-login-form',
  template: `
    <ion-content mode="ios">
      <ion-card color="none">
        <ion-card-header no-padding>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-item lines="none">
                  <ion-img slot="start" src="assets/VONLogo.png"> </ion-img>
                  <ion-title slot="end" no-padding>{{ title }}</ion-title>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-header>

        <ion-card-content no-padding>
          <form [formGroup]="fg" (ngSubmit)="onSubmit(fg)">
            <ion-item lines="full">
              <ion-label position="floating">Email</ion-label>
              <ion-input
                type="email"
                name="email"
                clearInput="true"
                formControlName="email"
                inputmode="email"
                (keyup.enter)="onSubmit(fg)"
              ></ion-input>
              <ion-note
                *ngIf="
                  fg['controls'].email.touched && fg['controls'].email.invalid
                "
              >
                <ion-text color="danger">Invalid username </ion-text></ion-note
              >
            </ion-item>

            <ion-item lines="full">
              <ion-label position="floating">Password</ion-label>
              <ion-input
                type="password"
                name="password"
                clearInput="true"
                formControlName="pass"
                (keyup.enter)="onSubmit(fg)"
              ></ion-input>
              <ion-note
                *ngIf="
                  fg['controls'].pass.touched && fg['controls'].pass.invalid
                "
              >
                <ion-text color="danger"> Invalid password</ion-text></ion-note
              >
            </ion-item>
          </form>
        </ion-card-content>
        <ion-item
          detail="true"
          lines="none"
          button
          name="Login"
          color="primary"
          (click)="onSubmit(fg)"
        >
          <ion-label color="light" slot="start">Submit</ion-label>
        </ion-item>
      </ion-card>
    </ion-content>
  `,
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  isInvalid = false;
  fg: FormGroup;
  title = 'Admin';
  subtitle = 'Login to the Admin Portal';
  constructor(
    private router: Router,
    private actionSvc: ActionService,
    private stateSvc: StateService,
    private loadingSvc: LoadingService
  ) {
    this.fg = new FormGroup({
      email: new FormControl(null, [
        Validators.email,
        Validators.minLength(6),
        Validators.required
      ]),
      pass: new FormControl(null, [
        Validators.minLength(6),
        Validators.required
      ])
    });
    this.fg.updateValueAndValidity();
  }

  ngOnInit() {}

  async onSubmit(fg: FormGroup) {
    if (fg.invalid) {
      fg.markAllAsTouched();
      fg.updateValueAndValidity();
      return (this.fg = fg);
    }
    const loading = await this.loadingSvc.startLoad({
      message: 'Logging you in'
    });
    await loading.present();
    const { email, pass } = fg.value;
    // return isAuthenticated ? this.progress({ loading }) : this.notAuth;
    // this.progress({ loading });

    return setTimeout(() => {
      this.progress({ loading }).then();
    }, 1000);
  }

  async progress(opts: { loading: HTMLIonLoadingElement }) {
    const { loading } = opts;
    await loading.dismiss();
    this.stateSvc.isAuthenticated = true;
    this.router.navigate(['/home']);
  }

  notAuth() {}
}
