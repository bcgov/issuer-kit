import * as request from 'superagent';
import {
  IIssueSend,
  IIssueOffer
} from '../../../interfaces/issue-credential.interface';

export type IssueCredByIdRouteType =
  | 'send-offer'
  | 'send-request'
  | 'issue'
  | 'store'
  | 'remove';

export class IssueService {
  private _url: string;
  private _segment: string = 'issue-credential/';

  constructor(url: string) {
    this._url = url + '/';
  }

  async getIssueCredentialRecords() {
    try {
      return await request.get(`${this._url}${this._segment}records`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async issueCredentialSend(cred: IIssueSend) {
    try {
      return await request.post(`${this._url}${this._segment}send`).send(cred);
    } catch (err) {
      return err;
    }
  }

  async sendOffer(cred: IIssueOffer) {
    try {
      return await request
        .post(`${this._url}${this._segment}send-offer`)
        .send(cred);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async postById(
    credExId: string,
    route: IssueCredByIdRouteType,
    params?: any
  ) {
    const path = `${this._url}${this._segment}records/${credExId}/${route}`;
    try {
      return params
        ? await request.post(path).send(params)
        : await request.post(path);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
