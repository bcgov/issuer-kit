import { Component, OnInit, Input } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { ActionService } from 'src/app/services/action.service';
import { IInvitationRecord } from 'src/app/shared/interfaces/invitation-record.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'waa-manage-users',
  template: `
    <ng-container *ngIf="$invitationRecords | async as invitationRecords">
      <ion-segment (ionChange)="segmentChanged($event)" color="primary">
        <ion-segment-button
          value="invited"
          [checked]="stateSvc.state === 'invited'"
        >
          <ion-label>Invited</ion-label>
        </ion-segment-button>
        <ion-segment-button
          value="confirmed"
          [checked]="stateSvc.state === 'confirmed'"
        >
          <ion-label>Confirmed</ion-label>
        </ion-segment-button>
      </ion-segment>
      <waa-user-list
        [invitationRecords]="invitationRecords"
        [changeRecords]="stateSvc.changeRecords"
        (changedRecords)="changed()"
      >
      </waa-user-list>
    </ng-container>
  `,
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  $invitationRecords: Observable<IInvitationRecord[]>;

  segmentChanged(event) {
    console.log(event.detail.value);
    this.actionSvc.changeState(event.detail.value);
  }

  changed() {
    console.log(this.stateSvc.changeRecords);
  }

  constructor(public stateSvc: StateService, public actionSvc: ActionService) {}

  ngOnInit() {
    this.actionSvc.loadData();
    this.stateSvc.$userList.subscribe(obs => console.log(obs));
    this.$invitationRecords = this.stateSvc.$userList;
  }
  clearRecords() {
    this.actionSvc.loadData();
  }
}
