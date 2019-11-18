import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IInvitationRecord } from '../shared/interfaces/invitation-record.interface';
import { KeycloakService } from 'keycloak-angular';

export type StateType = 'invited' | 'confirmed';

export interface IUser {
  username: string;
  email: string;
  emailVerified: boolean;
  firstname: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private $$userList = new BehaviorSubject<IInvitationRecord[]>(null);

  private _isAuthenticated = false;
  private _changeRecords = new Set<string>();

  private _state: StateType = 'invited';
  user: IUser;

  get state() {
    return this._state;
  }

  set state(state: StateType) {
    this._state = state;
  }

  get changeRecords() {
    return this._changeRecords;
  }
  $userList = this.$$userList.asObservable();

  clearChangeRecords() {
    this._changeRecords.clear();
  }

  set userList(records: IInvitationRecord[]) {
    this.$$userList.next(records);
  }

  get userList() {
    return this.$$userList.getValue();
  }

  set isAuthenticated(bool) {
    this._isAuthenticated = bool;
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  constructor(private keyCloakSvc: KeycloakService) {
    this.keyCloakSvc.loadUserProfile().then((obs: IUser) => (this.user = obs));
  }
}
