import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IInvitationRecord } from '../shared/interfaces/invitation-record.interface';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private $$userList = new BehaviorSubject<IInvitationRecord[]>(null);
  private _isAuthenticated = false;
  $userList = this.$$userList.asObservable();

  set userList(records: IInvitationRecord[]) {
    this.$$userList.next(records);
  }

  set isAuthenticated(bool) {
    this._isAuthenticated = bool;
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }
  constructor() {}
}
