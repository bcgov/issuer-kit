import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { StateService } from 'src/app/services/state.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActionService } from 'src/app/services/action.service';
import { Router } from '@angular/router';
import { ActionType } from 'src/app/shared/interfaces/actions.interface';
import { AlertService } from 'src/app/services/alert.service';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'waa-home',
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

    <ion-content padding fullscreen color="light">
      <ion-toolbar color="secondary">
        <ion-searchbar
          showCancelButton="focus"
          [formControl]="fc"
        ></ion-searchbar>
        <ion-buttons slot="secondary">
          <ion-button (click)="router.navigate(['/add-user'])" slot="start">
            <mat-icon slot="icon-only">person_add</mat-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button slot="start" [matMenuTriggerFor]="menu">
            <mat-icon slot="icon-only">more_vert</mat-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <waa-manage-users [$invitationRecords]="$records"> </waa-manage-users>
    </ion-content>
    <mat-menu #menu="matMenu">
      <button
        mat-menu-item
        *ngIf="stateSvc.state === 'confirmed'"
        (click)="changeAction('active')"
        [disabled]="stateSvc.changeRecords.size < 1"
      >
        Enable/Disable Access
      </button>
      <button
        *ngIf="stateSvc.state === 'invited'"
        mat-menu-item
        (click)="changeAction('email')"
        [disabled]="stateSvc.changeRecords.size < 1"
      >
        Send Invites
      </button>
      <button
        *ngIf="stateSvc.state === 'invited'"
        mat-menu-item
        (click)="changeAction('revoke')"
        [disabled]="stateSvc.changeRecords.size < 1"
      >
        Revoke Access
      </button>
      <button mat-menu-item (click)="clearChanges()">
        Clear Selections
      </button>
    </mat-menu>
  `,
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  title = 'Manage';

  $records: Observable<IInvitationRecord[]>;
  fc: FormControl;
  searchString: string;
  subscriptions: Subscription[];

  constructor(
    public stateSvc: StateService,
    public actionSvc: ActionService,
    public router: Router,
    private alertSvc: AlertService
  ) {}

  ngOnInit() {
    this.actionSvc.loadData();
    this.title = this.stateSvc.user.username;
    this.fc = new FormControl();
    this.$records = this.stateSvc.$userList;
    // .pipe(
    // map(obs => obs.filter(r => r.email.includes(this.searchString)))
    // );

    this.subscriptions.push(
      this.fc.valueChanges.subscribe(text => {
        if (text.length > 0) {
          this.$records = this.stateSvc.$userList.pipe(
            map(obs => obs.filter(r => r.email.includes(text)))
          );
        } else this.$records = this.stateSvc.$userList;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  action() {
    this.stateSvc.changeRecords.size > 0
      ? this.changeAction('active')
      : this.router.navigate(['/home/add-user']);
  }

  async changeAction(action: ActionType) {
    const records = Array.from(this.stateSvc.changeRecords.values()) || [];
    const message =
      action === 'email'
        ? 'Are you sure you want to resend invites?'
        : 'Are you sure you want to change user access?';
    const header = action === 'email' ? 'Re-send Invitations' : 'Change Access';
    const res = await this.alertSvc.confirmBox({ message, header });
    this.actionSvc.applyAction(action, records);
  }

  clearChanges() {
    this.actionSvc.clearRecords();
    this.$records = this.stateSvc.$userList;
  }
}
