import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'waa-login-form',
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title></ion-card-title>
        <ion-card-subtitle></ion-card-subtitle>
      </ion-card-header>

      <ion-card-content padding>
        <form [formGroup]="fg" (ngSubmit)="onSubmit(fg)">
          <ion-item lines="none">
            <ion-label position="floating">Email</ion-label>
            <ion-input
              ngModel
              type="email"
              name="email"
              formControlName="email"
            ></ion-input>
          </ion-item>

          <ion-item lines="none">
            <ion-label position="floating">Password</ion-label>
            <ion-input
              ngModel
              type="password"
              name="password"
              formControlName="pass"
            ></ion-input>
          </ion-item>
          <ion-item lines="none">
            <ion-toolbar>
              <ion-buttons slot="primary">
                <ion-button color="primary">
                  <ion-icon name="send" slot="end"></ion-icon>Login</ion-button
                >
              </ion-buttons>
            </ion-toolbar>
          </ion-item>
        </form>
      </ion-card-content>
    </ion-card>
  `,
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  isInvalid = false;
  fg: FormGroup;
  constructor() {
    this.fg = new FormGroup({
      email: new FormControl('', [Validators.minLength(4), Validators.email]),
      pass: new FormControl('', Validators.minLength(6))
    });
  }

  ngOnInit() {}

  onSubmit(fg: FormGroup) {
    if (fg.invalid) return (this.isInvalid = true);
  }
}
