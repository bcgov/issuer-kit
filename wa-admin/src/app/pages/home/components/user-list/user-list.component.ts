import { Component, OnInit, Input } from '@angular/core';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';

@Component({
  selector: 'waa-user-list',
  template: `
    <mat-selection-list *ngIf="invitationRecords">
      <waa-user-list-item
        *ngFor="let invitation of invitationRecords"
        [invitationRecord]="invitation"
      >
      </waa-user-list-item>
    </mat-selection-list>
  `,
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @Input() invitationRecords: IInvitationRecord[];

  constructor() {}

  ngOnInit() {
    console.log(this.invitationRecords);
  }
}
