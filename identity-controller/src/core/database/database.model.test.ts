import test from 'ava';

import {
  DBClient,
  IInvitationRecord,
  DatabaseCollectionType
} from './database.model';

import { resolve } from 'path';
const config = require('dotenv').config({
  path: resolve(__dirname, '../../../config.env')
});

console.log(config);

const connect = DBClient;
let dbOptions = {
  uri: `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_SERVICE}:${config.DB_PORT}/${config.DB_NAME}`
};

console.log(config.DB_USER);
const db = connect.getInstance(dbOptions);

const prefix = 'VALIDATORS: ';

const collection = 'invitations' as DatabaseCollectionType;

test(prefix + 'should insert an invitation', async t => {
  const record: IInvitationRecord = {
    consumed: false,
    email: 'sean.hamilton@quartech.com',
    method: 'github',
    jurisdiction: 'BC'
  };

  const result = await db.insertRecord({ collection: 'invitations', record });
  t.assert(result, 'defined');
});
test(prefix + 'should get invitation records', async function() {
  const result = await db.getRecords('invitations');
  // expect(result).toBeDefined;
});
test(prefix + 'should get a single invitation record', async function() {
  const records = await db.getRecords('invitations');
  const { id } = records[0];
  const record = await db.getRecord({ collection, id });
  // expect(record).toBeDefined;
});
