import * as request from 'superagent';
import { ISchema } from '../../../interfaces/schema.interface';
import {
  AppConfigurationService,
  APP_SETTINGS,
} from '../../../services/app-configuration-service';

export class SchemaService {
  agentAdminUrl: string;
  agentAdminApiKey: string;

  constructor() {
    this.agentAdminUrl = AppConfigurationService.getSetting(APP_SETTINGS.AGENT_ADMIN_URL);
    this.agentAdminApiKey = AppConfigurationService.getSetting(
      APP_SETTINGS.AGENT_ADMIN_API_KEY,
    );
  }

  /*
    Post a new schema to the ledger
  */
  async postSchema(schema: ISchema) {
    try {
      const res = await request
        .post(`${this.agentAdminUrl}/schemas`)
        .set('x-api-key', this.agentAdminApiKey)
        .send(schema);
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    find a schema by it's ID
  */
  async getSchemaById(id: string) {
    try {
      const res = await request
        .get(`${this.agentAdminUrl}/schemas/${id}`)
        .set('x-api-key', this.agentAdminApiKey);
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
