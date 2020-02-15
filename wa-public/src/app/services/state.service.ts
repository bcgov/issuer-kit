import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

export interface IValidateLink {
  _id: string;
  expired: boolean;
  active: boolean;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _isAuth = false;
  private _title = 'Identity Kit POC';
  private _apiUrl: string;
  userIdToken: any;

  get linkId() {
    return localStorage.getItem('linkId');
  }

  get _id() {
    return localStorage.getItem('id');
  }

  set _id(id: string) {
    localStorage.setItem('id', id);
  }

  set invitedUser(user: any) {
    localStorage.setItem('invitedUser', JSON.stringify(user));
  }

  get invitedUser() {
    return JSON.parse(localStorage.getItem('invitedUser'));
  }

  isValidToken(token: string): Observable<IValidateLink> {
    const url = `${this._apiUrl}/invitations/${token}/validate`;
    localStorage.setItem('linkId', token);
    return this.http.get<IValidateLink>(url);
  }

  get isAuth() {
    return this._isAuth;
  }

  get title() {
    return this._title;
  }

  constructor(private http: HttpClient) {
    this._apiUrl = AppConfigService.settings.apiServer.url;
  }
}
