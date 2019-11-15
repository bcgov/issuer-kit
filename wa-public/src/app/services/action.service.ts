import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private _isAuth = false;

  get isAuth() {
    return this.isAuth;
  }

  set isAuth(bool: boolean) {
    this._isAuth = bool;
  }
  constructor() {}
}
