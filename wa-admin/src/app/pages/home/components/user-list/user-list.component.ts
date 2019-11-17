import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { IChangeRecord } from 'src/app/shared/interfaces/change-record.interface';

@Component({
  selector: 'waa-user-list',
  template: `
    <ion-list *ngIf="invitationRecords">
      <waa-user-list-item
        *ngFor="let invitation of invitationRecords"
        (recordChange)="updateRecords($event)"
        [invitationRecord]="invitation"
      >
      </waa-user-list-item>
    </ion-list>
  `,
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() invitationRecords: IInvitationRecord[];
  @Input() changeRecords: Set<string>;

  @Output() changedRecords = new EventEmitter<Set<string>>();

  updateRecords(record: IChangeRecord) {
    const { _id } = record;
    this.changeRecords.has(_id)
      ? this.changeRecords.delete(_id)
      : this.changeRecords.add(_id);
    this.changedRecords.emit(this.changeRecords);
  }

  constructor() {}

  ngOnInit() {
    console.log(this.invitationRecords);
  }
}
