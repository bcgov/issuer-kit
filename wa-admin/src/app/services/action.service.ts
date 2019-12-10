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

const apiUrl = '/api/';

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
    return this.httpSvc.post<{ _id: string, error?: string }>('invitations', params);
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

  async revokeAccess(records: string[] | string) {
    if (Array.isArray(records)) {
      const arr = [];
      for (const record of records) {
        arr.push(
          this.http
            .post(`${this._apiUrl}invitations/${record}/revoke`, {
              addedBy: this.stateSvc.user.username
            })
            .toPromise()
        );
      }
      await Promise.all(arr);
      this.clearRecords();
      this.loadData();
    } else {
      const res = await this.http
        .post(`${this._apiUrl}invitations/${records}/revoke`, {
          addedBy: this.stateSvc.user.username
        })
        .toPromise();

    }

  }
  async sendEmail(records: string[] | string) {
    if (Array.isArray(records)) {
      const arr = [];
      for (const record of records) {
        arr.push(
          this.http
            .post(`${this._apiUrl}invitations/${record}/renew`, {
              addedBy: this.stateSvc.user.username
            })
            .toPromise()
        );
      }
      await Promise.all(arr);
      this.clearRecords();

      this.loadData();
    } else {
      const res = await this.http
        .post(`${this._apiUrl}invitations/${records}/renew`, {
          addedBy: this.stateSvc.user.username
        })
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
