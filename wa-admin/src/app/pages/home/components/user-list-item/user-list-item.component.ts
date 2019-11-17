import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'waa-user-list-item',
  template: `
    <mat-list-option *ngIf="invitationRecord">
      <mat-icon>account_circle </mat-icon>
      <h3 matLine *ngIf="firstName">{{ firstName }} {{ lastName }}</h3>
      <p matLine>
        {{ email }}
      </p>
      <p matLine>
        {{ jurisdiction }}
      </p>
      <mat-checkbox
        [checked]="active"
        (click)="activeChange(_id, !active)"
      ></mat-checkbox>
    </mat-list-option>
  `,
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent implements OnInit {
  @Input() invitationRecord: IInvitationRecord;
  @Output() recordChange: EventEmitter<{
    _id: string;
    active: boolean;
  }> = new EventEmitter();

  consumed: boolean;
  _id: any;
  method: string;
  email: string;
  jurisdiction: string;
  expiry: string;
  active: boolean;
  firstName: string;
  lastName: string;
  icon: string;

  fc: FormControl;

  activeChange(_id, active) {
    this.recordChange.emit({ _id, active });
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
      active
    } = this.invitationRecord;
    this._id = _id;
    this.consumed = consumed;
    this.method = method;

    this.email = email;
    this.jurisdiction = jurisdiction;
    this.expiry = expiry;
    this.active = active;
  }
}
