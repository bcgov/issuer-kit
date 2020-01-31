import { CredentialDefinitionService } from './credential-definition.service';

export class CredentialDefinition {
  _credentialSvc: CredentialDefinitionService;

  constructor() {
    this._credentialSvc = new CredentialDefinitionService();
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
