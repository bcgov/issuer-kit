import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private _isAuthenticated = false;

  set isAuthenticated(bool) {
    this.isAuthenticated = bool;
  }

  get isAuthenticated() {
    return this.isAuthenticated;
  }
  constructor() {}
}
