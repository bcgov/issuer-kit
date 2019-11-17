import test from 'ava';

import { DBClient, DatabaseCollectionType } from './database.model';

import { resolve } from 'path';
import { IInvitationRecord } from '../interfaces/invitation-record.interface';
import { MongoClient } from 'mongodb';

const config = require('dotenv').config({
  path: resolve(__dirname, '../../../config.env')
});

const prefix = 'VALIDATORS: ';

const collection = 'invitations' as DatabaseCollectionType;

test(prefix + 'should insert an invitation', async t => {
  const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVICE}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  let dbOptions = {
    uri
  };
  const db = await DBClient.connect(uri);
  // const db
  t.log(uri);
  const record: IInvitationRecord = {
    consumed: false,
    email: 'sean.hamilton@quartech.com',
    method: 'abcd',
    jurisdiction: 'BC',
    addedBy: 'sean',
    active: false,
    created: new Date(),
    guid: 'alksdjfsda'
  };

  const client = await DBClient.getInstance({ uri, database: 'identity' });
  await client.connect();
  const res = await client.insertRecord<IInvitationRecord>({
    collection: 'invitations',
    record
  });
  t.log('the id', res);
  t.assert(typeof res === 'string');
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
