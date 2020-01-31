import { CredentialDefinition } from '../../../core/agent-controller/modules/credential-definition/credential-definition.model';
import { Issue } from '../../../core/agent-controller/modules/issue/issue.model';
import { Schema } from '../../../core/agent-controller/modules/schema/schema.model';
import { ICredentialAttributes } from '../../../core/interfaces/issue-credential.interface';
import {
  AppConfigurationService,
  APP_SETTINGS,
} from '../../../core/services/app-configuration-service';
import { DefaultSchemaDefinition, ISchemaDefinition } from './schema';

import fs = require('fs');

export class IssueService {
  _issue: Issue;
  _credDef: CredentialDefinition;
  _schema: Schema;

  credDefId: string;

  schemaSpec: {
    attributes: string[];
    schema_name: string;
    schema_version: string;
  };

  constructor() {
    const schema = new Schema();
    const credDef = new CredentialDefinition();
    const issue = new Issue();

    this._schema = schema;
    this._credDef = credDef;
    this._issue = issue;
    this.schemaSpec = this.loadSchemaDefinition();

    const existingSchemaId = AppConfigurationService.getSetting(
      APP_SETTINGS.EXISTING_SCHEMA_ID,
    );
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
        console.log(
          `The following schema id will be used to issue credentials: ${schema.schema_id}`,
        );
        return schema.schema_id;
      })
      .then(id => this._credDef.createCredentialDefinition(id))
      .then(credDefId => (this.credDefId = credDefId.credential_definition_id));
  }

  loadSchemaDefinition() {
    const defaultSchemaDef = new DefaultSchemaDefinition();

    if (AppConfigurationService.getSetting(APP_SETTINGS.CUSTOM_SCHEMA_PATH)) {
      try {
        console.log(
          `Loading custom schema definition from ${AppConfigurationService.getSetting(
            APP_SETTINGS.CUSTOM_SCHEMA_PATH,
          )}`,
        );
        if (
          fs.existsSync(
            AppConfigurationService.getSetting(APP_SETTINGS.CUSTOM_SCHEMA_PATH),
          )
        ) {
          const rawdata = fs.readFileSync(
            AppConfigurationService.getSetting(APP_SETTINGS.CUSTOM_SCHEMA_PATH),
            'utf-8',
          );
          return JSON.parse(rawdata) as ISchemaDefinition;
        } else {
          console.warn(
            `The specified file path '${AppConfigurationService.getSetting(
              APP_SETTINGS.CUSTOM_SCHEMA_PATH,
            )}' does not exist, the default schema definition will be used.`,
          );
        }
      } catch (e) {
        console.error(
          'An exception occurred when trying to read the custom schema definition: ',
          e,
        );
      }
    }
    // No custom schema definition provided/loaded
    return defaultSchemaDef;
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
