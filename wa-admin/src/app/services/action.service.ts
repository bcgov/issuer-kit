import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IInvitationRecord } from '../shared/interfaces/invitation-record.interface';
import { StateService } from './state.service';

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
  },
  {
    _id: 'abc123',
    consumed: false,
    method: 'github',
    email: 'emiliano@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime(),
    active: true,
    firstName: 'Emiliano',
    lastName: 'Example',
    icon: 'github'
  },
  {
    _id: 'abcd',
    consumed: false,
    method: 'github',
    email: 'email@example.com',
    jurisdiction: 'BC',
    expiry: new Date().getTime(),
    active: false,
    firstName: 'Joe',
    lastName: 'Thomson',
    icon: 'github'
  }
] as IInvitationRecord[];

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(private httpSvc: HttpService, private stateSvc: StateService) {
    this.loadData();
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
}
