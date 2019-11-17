import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { IChangeRecord } from 'src/app/shared/interfaces/change-record.interface';

@Component({
  selector: 'waa-user-list-item',
  template: `
    <mat-card class="mat-elevation-z0">
      <ion-item>
        <mat-checkbox
          color="accent"
          [checked]="active"
          (click)="activeChange(_id)"
        >
        </mat-checkbox>

        <mat-card-header>
          <mat-card-title>{{ email }}</mat-card-title>
          <mat-card-subtitle>{{ firstName }} {{ lastName }} </mat-card-subtitle>
          <mat-card-subtitle>
            <ion-badge *ngIf="consumed" color="success">Active</ion-badge>
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <button mat-icon-button *ngIf="!consumed">
            <mat-icon color="primary"> mail</mat-icon>
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
  expiry: string;
  active: boolean;
  firstName: string;
  lastName: string;
  icon: string;

  record: IInvitationRecord;

  fc: FormControl;
  _id: any;

  activeChange(_id: string) {
    this.recordChange.emit({ _id });
  }

  clearChanges() {
    this.record.active = this.active;
  }

  constructor() {
    // this.fc = new FormControl(active);
  }

  ngOnInit() {
    console.log(this.invitationRecord);
    const {
      _id,
      consumed,
      method,
      email,
      jurisdiction,
      expiry,
      active,
      firstName,
      lastName
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
    of(this.active).subscribe(obs => console.log(obs));
  }
}
