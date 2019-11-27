import { Schema } from '../schema/schema.model';
import TestAgentConfig from '../../agent-test-config';
import { expect } from 'chai';
import 'mocha';
import { CredentialDefinition } from './credential-definition.model';
import { ISchemaResponse } from '../../../core/interfaces/schema.interface';

const agentConfig = new TestAgentConfig();
const schema = new Schema(agentConfig.agentUrl);
const credDef = new CredentialDefinition(agentConfig.agentUrl);

let schemaId: string;

beforeEach('test', async function() {
  const schemaDef = {
    schema_version: '1.0',
    schema_name: 'workplz',
    attributes: ['blarg', 'this', 'sucks', 'really']
  };
  const res = await schema.createSchema(schemaDef);
  schemaId = res.schema_id;
});
describe('create new credDef', async function() {
  it('should return a credential definition id', async function() {
    const res = await credDef.createCredentialDefinition(schemaId);
    expect(res).to.not.be.undefined;
    expect(res).to.haveOwnProperty('credential_definition_id');
  });
  it('should not return a cred def id', async function() {
    const res = await credDef.createCredentialDefinition('abc');
    expect(res).to.not.haveOwnProperty('credential_definition_id');
  });
});
