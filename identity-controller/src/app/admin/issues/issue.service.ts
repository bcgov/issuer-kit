import { CredentialDefinition } from '../../../core/agent-controller/modules/credential-definition/credential-definition.model';
import { Issue } from '../../../core/agent-controller/modules/issue/issue.model';
import { Schema } from '../../../core/agent-controller/modules/schema/schema.model';
import { ICredentialAttributes } from '../../../core/interfaces/issue-credential.interface';
import schemaDef from './schema';

export class IssueService {
  _issue: Issue;
  _credDef: CredentialDefinition;
  _schema: Schema;

  credDefId: string;

  apiUrl: string;
  schemaSpec: {
    attributes: string[];
    schema_name: string;
    schema_version: string;
  };

  constructor(apiUrl: string, existingSchemaId?: string) {
    this.apiUrl = apiUrl;

    const schema = new Schema(apiUrl);

    const credDef = new CredentialDefinition(apiUrl);

    const issue = new Issue(apiUrl);

    this._schema = schema;
    this._credDef = credDef;
    this._issue = issue;
    this.schemaSpec = schemaDef;

    let schemaPromise;
    if (existingSchemaId) {
      console.log(
        `Attempting to fetch schema id from ledger, provided schema id is: ${existingSchemaId}`,
      );
      schemaPromise = this._schema
        .getSchemaById(existingSchemaId)
        .then(response => {
          if (!response.schema_json) {
            console.error(
              `The provided schema id [${existingSchemaId}] was not found on the Ledger, it will NOT be possible to issue credentials.`,
            );
            console.error(
              `To correct this, either provide a valid schema id or leave the EXISTING_SCHEMA_ID environment variable blank to attempt registering a new schema.`,
            );
            return { schema_id: null };
          }
          return { schema_id: response.schema_json.id };
        });
    } else {
      console.log(`Registering new schema id on the ledger...`);
      schemaPromise = this._schema
        .createSchema(this.schemaSpec)
        .then(response => {
          return response;
        });
    }

    schemaPromise
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
      const credDefId = await this._credDef.createCredentialDefinition(
        res.schema_id,
      );
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
  return new Date(year + offset, month, day);
}
