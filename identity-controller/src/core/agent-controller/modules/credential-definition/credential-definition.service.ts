import * as request from 'superagent';
import {
  AppConfigurationService,
  APP_SETTINGS,
} from '../../../services/app-configuration-service';

export interface ICredDefSendResponse {
  credential_definition_id: string;
}

export class CredentialDefinitionService {
  agentAdminUrl: string;
  agentAdminApiKey: string;

  readonly segment: string = 'credential-definitions';

  constructor() {
    this.agentAdminUrl = AppConfigurationService.getSetting(APP_SETTINGS.AGENT_ADMIN_URL);
    this.agentAdminApiKey = AppConfigurationService.getSetting(
      APP_SETTINGS.AGENT_ADMIN_API_KEY,
    );
  }

  /*
    send a credential definition to the ledger. If it exists already it will
    return an existing credential definition
  */
  async sendCredentialDefinition(
    schemaId: string,
  ): Promise<ICredDefSendResponse> {
    try {
      const res = await request
        .post(`${this.agentAdminUrl}/${this.segment}`)
        .set('x-api-key', this.agentAdminApiKey)
        .send({ schema_id: schemaId, tag: 'default' });
      // if (!id) throw new Error('no credential id found');
      return res.body;
    } catch (err) {
      return err.message;
    }
  }

  /*
    get credential definition by id
  */
  async getCredentialDefinition(id: string) {
    const path = `${this.agentAdminUrl}/${this.segment}/${id}`;
    console.log(path);
    try {
      const res = await request
        .get(path)
        .set('x-api-key', this.agentAdminApiKey);
      return res;
    } catch (err) {
      return err.message;
    }
  }
}
