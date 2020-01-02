import schemaDef from './schema';
import { CredentialDefinition } from '../../../core/agent-controller/modules/credential-definition/credential-definition.model';
import { Schema } from '../../../core/agent-controller/modules/schema/schema.model';
import { Issue } from '../../../core/agent-controller/modules/issue/issue.model';
import { ICredentialAttributes } from '../../../core/interfaces/issue-credential.interface';

export class IssueService {
  _issue: Issue;
  _credDef: CredentialDefinition;
  _schema: Schema;

  credDefId: string;

  apiUrl: string;
  schemaSpec: { attributes: string[]; schema_name: string; schema_version: string; };

  constructor (apiUrl: string) {
    console.log(apiUrl);
    this.apiUrl = apiUrl;
    const schema = new Schema(apiUrl);

    const credDef = new CredentialDefinition(apiUrl);

    const issue = new Issue(apiUrl);
    this._schema = schema;
    this._credDef = credDef;
    this._issue = issue;
    this.schemaSpec = schemaDef;

    this._schema
      .createSchema(this.schemaSpec)
      .then(schema => {
        console.log('schemaId', schema);
        return schema.schema_id;
      })
      .then(id => this._credDef.createCredentialDefinition(id))
      .then(credDefId => (this.credDefId = credDefId.credential_definition_id));
  }

  async credentialStatus(id: string) {
    const res = await this._issue.records();
    return res.find(record => record.credential_exchange_id === id);
  }

  async issueCredential(args: {
    connId: string;
    attrs: ICredentialAttributes[];
  }) {
    const { connId, attrs } = args;
    if (!this.credDefId) {
      const res = await this._schema.createSchema(this.schemaSpec);
      const credDefId = await this._credDef.createCredentialDefinition(res.schema_id);
      this.credDefId = credDefId.credential_definition_id;
    }
    try {
      const res = await this._issue.issueOfferSend(
        connId,
        'issued by identity kit poc',
        attrs,
        this.credDefId,
      );
      return res;
    } catch (err) {
      console.log('issue credential error', err);
    }
  }
}

export function futureDate(offset: number = 99) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  return new Date(year + offset, month, day)
}