import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor() {}

  async authenticate(opts: { email: string; pass: string }): Promise<any> {
    const { email, pass } = opts;
    return true;
  }
}
