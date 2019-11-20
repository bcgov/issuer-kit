import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IInvitationRecord } from '../shared/interfaces/invitation-record.interface';
import { StateService, StateType } from './state.service';
import { ActionType } from '../shared/interfaces/actions.interface';
import { of } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

const testData = [
  {
    _id: 'abcdef',
    consumed: false,
    method: 'github',
    email: 'sean@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime() + 5000000,
    active: true,
    firstName: '',
    lastName: '',
    expired: false,
    icon: '',
    created: new Date().getTime() - 5000000,
    addedBy: 'admin@example.com'
  },
  {
    _id: 'xyzeabced',
    consumed: false,
    method: 'github',
    email: 'billy@example.com',
    jurisdiction: 'BC',
    expired: true,
    expiry: new Date().getTime() - 5000000,
    active: true,
    firstName: '',
    lastName: '',
    icon: '',
    created: new Date().getTime() - 10000000,
    addedBy: 'admin@example.com',
    activity: [{}]
  }
] as IInvitationRecord[];

const confirmed = [
  {
    _id: 'abc123',
    consumed: true,
    method: 'github',
    email: 'emiliano@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime(),
    active: true,
    firstName: 'Emiliano',
    lastName: 'Example',
    icon: 'github',
    created: new Date().getTime() - 25000000,
    addedBy: 'admin@example.com',
    updatedBy: 'someotheradmin@example.com',
    issued: true,
    activity: [{}]
  },
  {
    _id: 'abcd',
    consumed: true,
    method: 'github',
    email: 'email@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime(),
    active: true,
    firstName: 'Joe',
    lastName: 'Thomson',
    icon: 'github',
    created: new Date().getTime() - 35000000,
    updatedBy: 'admin@axemple.com',
    addedBy: 'anotheradmin@example.com',
    issued: false,
    activity: [{}]
  }
];

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  invitedUsers: IInvitationRecord[];
  confirmedUsers: IInvitationRecord[];
  constructor(
    private httpSvc: HttpService,
    private stateSvc: StateService,
    private keyCloakSvc: KeycloakService
  ) {
    this.invitedUsers = testData;
    this.confirmedUsers = confirmed.map(r => ({ changed: r.active, ...r }));
    this.loadData();
  }

  loadData() {
    this.stateSvc.userList =
      this.stateSvc.state === 'invited'
        ? this.invitedUsers
        : this.confirmedUsers;
  }

  async createInvitation(params: {
    method: string;
    jurisdiction: string;
    email: string;
    firstName: string;
    lastName: string;
  }) {
    // TODO: SH: Hook this up to the back end
    // return this.httpSvc.post<{ _id: string }>('invitations', params);
    return params;
  }

  applyAction(action: ActionType, records?: string[]) {
    const actions = {
      clear: rec => this.clearRecords(),
      change: rec => this.changeAccess(rec),
      email: rec => this.sendEmail(rec),
      revoke: rec => this.revokeAccess(rec)
    };
    this.stateSvc.clearChangeRecords();
    console.log(action);
    return actions[action](records);
  }

  revokeAccess(records: string[] | string) {
    if (Array.isArray(records)) {
      for (let record of records) {
        this.revokeAccess(record);
      }
    } else {
      const users = this.confirmedUsers;
      const index = users.findIndex(itm => itm._id === records);
      if (index >= 0) {
        const itm = users.find(itm => itm._id === records);
        const { active, ...noActive } = itm;
        const newActive = !active;
        const newUser = {
          active: newActive,
          updatedBy: this.stateSvc.user.email,
          ...noActive
        };
        users[index] = newUser;
        this.confirmedUsers = users;
        return this.stateSvc.setUserList(users);
      } else {
        const users = this.invitedUsers;
        const itm = users.find(itm => itm._id === records);
        const index = users.findIndex(itm => itm._id === records);
        const { active, ...noActive } = itm;
        const newActive = !active;
        const newUser = {
          active: newActive,
          updatedBy: this.stateSvc.user.email,
          ...noActive
        };
        users[index] = newUser;
        this.invitedUsers = users;
        this.stateSvc.setUserList(users);
        this.clearRecords();
      }
    }
  }

  sendEmail(records: string[] | string) {
    if (Array.isArray(records)) {
      for (let record of records) {
        this.sendEmail(record);
      }
    } else {
      const users = this.invitedUsers;
      const itm = users.find(itm => itm._id === records);
      const index = users.findIndex(itm => itm._id === records);
      const { expired, expiry, ...noExpired } = itm;
      const newExpired = false;
      const created = new Date();
      const newExpiry = new Date(created);
      newExpiry.setDate(created.getDate() + 1);
      const newUser = {
        updatedBy: this.stateSvc.user.email,
        expired: newExpired,
        expiry: newExpiry.getTime(),
        ...noExpired
      };
      users[index] = newUser;
      this.invitedUsers = users;
      return this.stateSvc.setUserList(users);
    }
  }

  changeAccess(records: string[]) {
    const users = records.map(record => {
      const { active, ...noActive } = this.stateSvc.userList.filter(
        user => user._id === record
      )[0];
      return { active: !active, ...noActive };
    });
    this.stateSvc.userList = users;
  }

  changeState(state: StateType) {
    this.stateSvc.state = state;
    this.stateSvc.userList =
      state === 'invited' ? this.invitedUsers : this.confirmedUsers;
  }

  getRecord(id: string) {
    const recordList = [
      ...this.invitedUsers,
      ...this.confirmedUsers
    ] as IInvitationRecord[];
    return of(recordList.filter(record => record._id === id)[0]);
  }

  clearRecords() {
    this.stateSvc.changeRecords.clear();
    const state = this.stateSvc.state;
    const recordList =
      state === 'invited' ? this.invitedUsers : this.confirmedUsers;
    this.stateSvc.userList =
      state === 'invited'
        ? recordList.map(record => {
            const { changed, ...noChanged } = record;

            return { changed: false, ...noChanged };
          })
        : recordList.map(record => {
            const { changed, active, ...noChanged } = record;
            return { changed: active, active, ...noChanged };
          });
  }
  logout() {
    this.keyCloakSvc.logout();
  }
}
