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

const uri = `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_SERVICE}:${config.DB_PORT}/${config.DB_NAME}`;
console.log('mongo string', uri);

const prefix = 'VALIDATORS: ';

const collection = 'invitations' as DatabaseCollectionType;

test(prefix + 'should insert an invitation', async t => {
  const connect = DBClient;

  const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVICE}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  let dbOptions = {
    uri
  };
  t.log(uri);
  const db = await connect.getInstance(dbOptions);
  t.log(db.database);
  const record: IInvitationRecord = {
    consumed: false,
    email: 'sean.hamilton@quartech.com',
    method: 'github',
    jurisdiction: 'BC'
  };

  const result = await db.insertRecord({ collection: 'invitations', record });
  t.assert(result, 'defined');
});
test(prefix + 'should get invitation records', async t => {
  // const result = await db.getRecords('invitations');
  // expect(result).toBeDefined;
  t.pass();
});
test(prefix + 'should get a single invitation record', async t => {
  // const records = await db.getRecords('invitations');
  // const { id } = records[0];
  // const record = await db.getRecord({ collection, id });
  // expect(record).toBeDefined;
  t.pass();
});
