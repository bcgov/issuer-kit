import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _isAuth = false;
  private _title = 'Identity Kit POC';
  private _token = 'abcd';

  private validTokens = ['abcd'];

  evalToken(id: string) {
    return this.validTokens.some(source => id === source);
  }
  // TODO: @ES: update this function for is authenticated logic
  set isAuth(bool: boolean) {
    this._isAuth = bool;
  }
  get isAuth() {
    return this._isAuth;
  }
  get title() {
    return this._title;
  }
  constructor() {}
}
