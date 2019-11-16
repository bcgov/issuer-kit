import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _isAuth = false;
  private _title = 'Identity Kit POC';

  isValidToken(token: string) {
    // this.http.post('/api/check-invite', {
    //   "token": token
    // });
    // TODO @SH: call API on controller to verify token is valid

    if (!this._isAuth) {
      this._isAuth = token !== '123-456-789' ? false : true;
    }

    return this._isAuth;
  }

  get isAuth() {
    return this._isAuth;
  }

  get title() {
    return this._title;
  }

  constructor(private http: HttpClient) {}
}
