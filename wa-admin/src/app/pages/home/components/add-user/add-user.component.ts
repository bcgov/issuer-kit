import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/services/action.service';
import { AlertService } from 'src/app/services/alert.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { FormConfigService, IFormConfig } from 'src/app/services/form-config.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'waa-add-user',
  template: `
    <waa-item-header title="Invite"> </waa-item-header>
    <waa-view-wrapper>
      <div class="view-wrapper">

        <mat-card [formGroup]="formGroup" *ngIf="index === 0; else preview">
            <waa-card-toolbar title="Invite User"> </waa-card-toolbar>

            <div *ngFor="let formElement of formTemplate">
              <div [ngSwitch]="formElement.type">
                  <ion-item>
                    <ion-label position="stacked">{{formElement.label}}<ion-text color="danger">*</ion-text></ion-label>

                    <div *ngSwitchCase="'textInput'">
                      <ion-input formControlName="{{formElement.fieldName}}" placeholder="{{formElement.placeholder}}" (keyup.enter)="submit(formGroup)"></ion-input>
                    </div>
                    <div *ngSwitchCase="'radio'">
                      <ion-radio-group no-padding formControlName="{{formElement.fieldName}}">
                        <ion-item lines="none" *ngFor="let radioElement of formElement.options">
                          <ion-radio value="{{radioElement.value}}" slot="start"></ion-radio>
                          <ion-label *ngIf="radioElement.label">{{radioElement.label}}</ion-label>
                          <ion-icon *ngIf="radioElement.logo" name="{{radioElement.logo}}"></ion-icon>
                        </ion-item>
                      </ion-radio-group>
                    </div>

                  <ion-note *ngIf="(invalid && formGroup['controls'][formElement.fieldName].invalid) || (formGroup['controls'][formElement.fieldName].touched && formGroup['controls'][formElement.fieldName].invalid)">
                    <ion-text color="danger">Invalid {{formElement.label}}</ion-text>
                  </ion-note>
                </ion-item>
              </div>
            </div>
        </mat-card>

          <ion-footer>
            <ion-toolbar color="secondary">
              <ion-buttons slot="secondary" *ngIf="this.index">
                <ion-button (click)="this.index = 0">
                  <mat-icon>arrow_back_ios</mat-icon>
                  <ion-label>Back</ion-label>
                </ion-button>
              </ion-buttons>
              <ion-buttons slot="primary">
                <ion-button (click)="submit(formGroup)">
                  <ion-label slot="start">{{ nextLabel }}</ion-label>
                  <mat-icon>arrow_forward_ios</mat-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-footer>

      </div>
    </waa-view-wrapper>

    <ng-template #preview>
      <waa-add-user-preview
        [email]="formGroup.value['email']"
        [firstName]="formGroup.value['firstName']"
        [lastName]="formGroup.value['lastName']"
        link="{{ url }}/new-link"
        state="unsubmitted"
        [fields]="fields"
      >
      </waa-add-user-preview>
    </ng-template>
  `,
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  formGroup: FormGroup;
  formTemplate: IFormConfig[];
  index = 0;
  invalid: boolean;
  url: string;

  constructor(
    private actionSvc: ActionService,
    private stateSvc: StateService,
    private alertSvc: AlertService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.url = AppConfigService.settings.publicSite.url;
    this.formTemplate = FormConfigService.fields;
    this.buildFormFromTemplate();
  }

  buildFormFromTemplate() {
    let formGroup = {};
    FormConfigService.fields.forEach((formItem: IFormConfig) => {
      const validators = [];
      formItem.validators.forEach(validator => {
        validators.push(Validators[validator]);
      });
      formGroup[formItem.fieldName] = new FormControl('', validators);
    });
    this.formGroup = new FormGroup(formGroup);
  }

  async submit(formGroup) {
    if (formGroup.invalid) {
      formGroup.markAsTouched();
      formGroup.updateValueAndValidity();
      this.invalid = true;
      return (this.formGroup = formGroup);
    }

    const formFields = {
      addedBy: this.stateSvc.user.username
    };
    this.formTemplate.forEach( formItem => {
      formFields[formItem.fieldName] = this.formGroup.value[formItem.fieldName];
    });

    if (this.index === 0) {
      this.index = 1;
    } else {
      try {
        await this.actionSvc
          .createInvitation(formFields)
          .toPromise();

        const res = await this.alertSvc.confirmBox({
          header: 'Invitation Sent!',
          message: 'Would you like to create another user?',
          decline: 'Home',
          confirm: 'Add another'
        });
        if (res || !AppConfigService.settings.userList.enabled) {
          return this.resetState();
        }
        return this.router.navigate(['/']);
      } catch (err) {
        console.log(err);
        this.alertSvc.error({
          header: 'The invitation email was not sent',
          message: err.error.error.message
        });
        return this.resetState();
      }
    }
  }

  resetState() {
    this.buildFormFromTemplate();
    this.index = 0;
  }

  get nextLabel() {
    return !this.index ? 'Next' : 'Submit';
  }

  get fields() {
    const created = new Date();
    const expiry = new Date(created);
    expiry.setDate(created.getDate() + 1);
    const fields = [
      {
        key: 'expiry',
        value: expiry
      },
      {
        key: 'created',
        value: created
      },
      {
        key: 'addedBy',
        value: this.stateSvc.user.email
      }
    ];
    this.formTemplate.forEach( formItem => {
      fields.push({ key: formItem.fieldName, value: this.formGroup.value[formItem.fieldName] });
    });
    return fields;
  }
}
