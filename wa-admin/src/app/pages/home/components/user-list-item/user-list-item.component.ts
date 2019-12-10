import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { FormControl } from '@angular/forms';
import { IChangeRecord } from 'src/app/shared/interfaces/change-record.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'waa-user-list-item',
  template: `
    <mat-card class="mat-elevation-z0">
      <ion-item>
        <mat-checkbox
          color="accent"
          [(ngModel)]="invitationRecord.changed"
          (change)="activeChange(_id)"
        >
        </mat-checkbox>

        <mat-card-header (click)="viewItem(_id)">
          <mat-card-title (click)="viewItem(_id)">{{ email }}</mat-card-title>
          <mat-card-subtitle (click)="viewItem(_id)"
            >{{ firstName }} {{ lastName }}
          </mat-card-subtitle>
          <mat-card-subtitle *ngIf="!active" (click)="viewItem(_id)">
            <ion-badge *ngIf="!active" color="danger">disabled</ion-badge>
          </mat-card-subtitle>
          <mat-card-subtitle *ngIf="consumed && active" (click)="viewItem(_id)">
            <ion-badge *ngIf="consumed && !issued" color="warning"
              >logged in</ion-badge
            >
            <ion-badge *ngIf="consumed && issued" color="success"
              >issued</ion-badge
            >
          </mat-card-subtitle>
          <mat-card-subtitle
            *ngIf="!consumed && active"
            (click)="viewItem(_id)"
          >
            <ion-badge *ngIf="expired" color="warning">expired</ion-badge>
            <ion-badge *ngIf="!expired" color="success">sent</ion-badge>
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="ion-float-right">
          <button mat-icon-button (click)="viewItem(_id)">
            <mat-icon color="primary">arrow_forward_ios</mat-icon>
          </button>
        </mat-card-content>
      </ion-item>
    </mat-card>
  `,
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent implements OnInit {
  @Input() invitationRecord: IInvitationRecord;
  @Output() recordChange: EventEmitter<IChangeRecord> = new EventEmitter<
    IChangeRecord
  >();

  consumed: boolean;
  method: string;
  email: string;
  jurisdiction: string;
  expiry: number;
  active: boolean;
  firstName: string;
  lastName: string;
  icon: string;

  record: IInvitationRecord;

  fc: FormControl;
  _id: any;
  expired: any;
  issued: boolean;

  activeChange(_id: string) {
    this.recordChange.emit({ _id });
  }

  clearChanges() {
    this.record.active = this.active;
  }

  viewItem(_id: string) {
    this.router.navigate([`/view/${_id}`]);
  }

  constructor(private router: Router) {
    // this.fc = new FormControl(active);
  }
  ngOnInit() {
    const {
      _id,
      consumed,
      method,
      email,
      jurisdiction,
      expiry,
      active,
      firstName,
      lastName,
      expired,
      issued
    } = this.invitationRecord;
    this.consumed = consumed;
    this.method = method;

    this.email = email;
    this.jurisdiction = jurisdiction;
    this.expiry = expiry;
    this.active = active;
    this.firstName = firstName;
    this.lastName = lastName;
    this._id = _id;
    this.expired = expired;
    this.issued = issued;
  }
}
