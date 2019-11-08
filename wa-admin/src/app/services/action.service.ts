import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(private httpSvc: HttpService) {}

  async authenticate(opts: { email: string; pass: string }): Promise<any> {
    const { email, pass } = opts;
    return true;
  }

  async createInvitation(params: {
    method: string;
    jurisdiction: string;
    email: string;
  }) {
    return this.httpSvc.post<{ _id: string }>('invitations', params);
  }
}
