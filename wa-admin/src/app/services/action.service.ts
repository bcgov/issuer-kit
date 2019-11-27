import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IInvitationRecord } from '../shared/interfaces/invitation-record.interface';
import { StateService, StateType } from './state.service';
import { ActionType } from '../shared/interfaces/actions.interface';
import { of } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  invitedUsers: IInvitationRecord[];
  confirmedUsers: IInvitationRecord[];
  _apiUrl: string;
  constructor(
    private httpSvc: HttpService,
    private stateSvc: StateService,
    private keyCloakSvc: KeycloakService,
    private http: HttpClient
  ) {
    this._apiUrl = apiUrl;
    this.loadData();
  }

  loadData() {
    const obs = this.httpSvc.get<IInvitationRecord[]>('invitations');
    obs.pipe(take(1)).subscribe(val => {
      this.stateSvc.userList =
        this.stateSvc.state === 'invited'
          ? val.filter(user => !user.consumed)
          : val.filter(user => user.consumed);
    });
  }

  createInvitation(params: {
    method: string;
    jurisdiction: string;
    email: string;
    firstName: string;
    lastName: string;
    addedBy: string;
  }) {
    // TODO: SH: Hook this up to the back end
    return this.httpSvc.post<{ _id: string }>('invitations', params);
    // return params;
  }

  applyAction(action: ActionType, records?: string[]) {
    const actions = {
      clear: rec => this.clearRecords(),
      change: rec => this.changeAccess(rec),
      email: rec => this.sendEmail(rec),
      revoke: rec => this.revokeAccess(rec)
    };
    this.stateSvc.clearChangeRecords();
    return actions[action](records);
  }

  revokeAccess(records: string[] | string) {
    if (Array.isArray(records)) {
      for (const record of records) {
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
  // http://localhost:5000/invitations/5dd8715e9273bf009d687fda/renew
  async sendEmail(records: string[] | string) {
    if (Array.isArray(records)) {
      const arr = [];
      for (let record of records) {
        arr.push(
          this.http
            .post(`${this._apiUrl}invitations/${record}/renew`, {})
            .toPromise()
        );
      }
      await Promise.all(arr);
      this.loadData();
    } else {
      const res = await this.http
        .post(`${this._apiUrl}invitations/${records}/renew`, {})
        .toPromise();
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
    this.loadData();
  }

  getRecord(id: string) {
    return this.httpSvc.get<IInvitationRecord>('invitations', {}, id);
  }

  clearRecords() {
    this.stateSvc.changeRecords.clear();
    this.loadData();
  }
  logout() {
    this.keyCloakSvc.logout();
  }
}
