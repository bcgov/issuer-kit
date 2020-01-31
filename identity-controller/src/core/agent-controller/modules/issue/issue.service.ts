import * as request from 'superagent';
import {
  IIssueOffer,
  IIssueSend,
} from '../../../interfaces/issue-credential.interface';
import {
  AppConfigurationService,
  APP_SETTINGS,
} from '../../../services/app-configuration-service';

export type IssueCredByIdRouteType =
  | 'send-offer'
  | 'send-request'
  | 'issue'
  | 'store'
  | 'remove';

export class IssueService {
  agentAdminUrl: string;
  agentAdminApiKey: string;

  readonly _segment: string = 'issue-credential';

  constructor() {
    this.agentAdminUrl = AppConfigurationService.getSetting(APP_SETTINGS.AGENT_ADMIN_URL);
    this.agentAdminApiKey = AppConfigurationService.getSetting(
      APP_SETTINGS.AGENT_ADMIN_API_KEY,
    );
  }

  async getIssueCredentialRecords() {
    try {
      return await request
        .get(`${this.agentAdminUrl}/${this._segment}/records`)
        .set('x-api-key', this.agentAdminApiKey);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async issueCredentialSend(cred: IIssueSend) {
    try {
      return await request
        .post(`${this.agentAdminUrl}/${this._segment}/send`)
        .set('x-api-key', this.agentAdminApiKey)
        .send(cred);
    } catch (err) {
      return err;
    }
  }

  async sendOffer(cred: IIssueOffer) {
    try {
      return await request
        .post(`${this.agentAdminUrl}/${this._segment}/send-offer`)
        .set('x-api-key', this.agentAdminApiKey)
        .send(cred);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async postById(
    credExId: string,
    route: IssueCredByIdRouteType,
    params?: any,
  ) {
    const path = `${this.agentAdminUrl}/${this._segment}/records/${credExId}/${route}`;
    try {
      return params
        ? await request
            .post(path)
            .set('x-api-key', this.agentAdminApiKey)
            .send(params)
        : await request.post(path).set('x-api-key', this.agentAdminApiKey);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
