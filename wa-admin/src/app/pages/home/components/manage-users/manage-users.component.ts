import { Component, OnInit, Input } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { ActionService } from 'src/app/services/action.service';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'waa-manage-users',
  template: `
    <ng-container *ngIf="$invitationRecords | async as invitationRecords">
      <waa-user-list [invitationRecords]="invitationRecords"> </waa-user-list>
    </ng-container>
  `,
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  $invitationRecords: Observable<IInvitationRecord[]>;
  constructor(public stateSvc: StateService, public actionSvc: ActionService) {}

  ngOnInit() {
    this.actionSvc.loadData();
    this.stateSvc.$userList.subscribe(obs => console.log(obs));
    this.$invitationRecords = this.stateSvc.$userList;
  }
}
