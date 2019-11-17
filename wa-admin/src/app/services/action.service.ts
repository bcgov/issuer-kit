import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IInvitationRecord } from '../shared/interfaces/invitation-record.interface';
import { StateService, StateType } from './state.service';
import { ActionType } from '../shared/interfaces/actions.interface';

const testData = [
  {
    _id: 'abcdef',
    consumed: false,
    method: 'github',
    email: 'sean@example.com',
    jurisdiction: 'BC',
    expiry: (new Date().getTime() + 60 * 60 * 24 * 1000).toString(),
    active: false,
    firstName: '',
    lastName: '',
    icon: ''
  }
] as IInvitationRecord[];

const confirmed = [
  {
    _id: 'abc123',
    consumed: true,
    method: 'github',
    email: 'emiliano@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime().toString(),
    active: true,
    firstName: 'Emiliano',
    lastName: 'Example',
    icon: 'github'
  },
  {
    _id: 'abcd',
    consumed: true,
    method: 'github',
    email: 'email@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime().toString(),
    active: false,
    firstName: 'Joe',
    lastName: 'Thomson',
    icon: 'github'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  invitedUsers: IInvitationRecord[];
  confirmedUsers: IInvitationRecord[];
  constructor(private httpSvc: HttpService, private stateSvc: StateService) {
    this.loadData();
    this.invitedUsers = testData;
    this.confirmedUsers = confirmed;
  }

  async authenticate(opts: { email: string; pass: string }): Promise<any> {
    const { email, pass } = opts;
    return true;
  }

  loadData() {
    this.stateSvc.userList = testData;
  }

  async createInvitation(params: {
    method: string;
    jurisdiction: string;
    email: string;
  }) {
    // TODO: SH: Hook this up to the back end
    // return this.httpSvc.post<{ _id: string }>('invitations', params);
  }

  applyAction(action: ActionType, records?: string[]) {
    const actions = {
      clear: this.clearRecords(),
      change: this.changeAccess(records)
    };
    return actions[action];
  }

  clearRecords() {
    this.stateSvc.changeRecords.clear();
  }

  changeAccess(records: string[]) {
    const users = records.map(record => {
      const { active, ...noActive } = this.stateSvc.userListValues.filter(
        user => user._id === record
      )[0];
      return { active: !active, ...noActive };
    });
    console.log(users);
    this.stateSvc.userList = users;
  }

  changeState(state: StateType) {
    this.stateSvc.userList =
      state === 'invited' ? this.invitedUsers : this.confirmedUsers;
  }
}
