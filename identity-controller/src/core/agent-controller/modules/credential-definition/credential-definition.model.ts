import { Schema } from '../schema/schema.model';
import { CredentialDefinitionService } from './credential-definition.service';

export class CredentialDefinition {
  _credentialSvc: CredentialDefinitionService;

  constructor(apiUrl: string) {
    this._credentialSvc = new CredentialDefinitionService(apiUrl);
  }

  async createCredentialDefinition(id: string) {
    try {
      const res = await this._credentialSvc.sendCredentialDefinition(id);
      return res;
    } catch (err) {
      return err.message;
    }
  }

  async getCredentialDefinition(id: string) {
    try {
      const res = await this._credentialSvc.getCredentialDefinition(id);
      return res.body;
    } catch (err) {
      throw new Error(err);
    }
  }
}
