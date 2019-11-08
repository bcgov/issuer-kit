import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _isAuthenticated = false;

  set isAuthenticated(bool) {
    this._isAuthenticated = bool;
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }
  constructor() {}
}
