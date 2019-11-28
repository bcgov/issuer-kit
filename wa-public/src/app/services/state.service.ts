import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiUrl = '/api/';

export interface IUser extends Keycloak.KeycloakProfile {
  _id?: string;
  guid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _isAuth = false;
  private _title = 'Identity Kit POC';

  user: IUser = {};
  private _apiUrl: string;

  async isValidToken(token: string) {
    const url = `${this._apiUrl}invitations/${token}/validate`;
    return await this.http.get<{ validated: boolean, _id: string }>(url).toPromise();
  }

  get isAuth() {
    return this._isAuth;
  }

  get title() {
    return this._title;
  }

  constructor(private http: HttpClient) {
    this._apiUrl = apiUrl;
  }
}
