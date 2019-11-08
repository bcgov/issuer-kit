import { config } from 'dotenv';
import { resolve } from 'path';

import admin from './app/admin/admin';
import Router = require('koa-router');

import client from './core/database/database.model';
import watchers from './core/watchers/database.watchers';

config({ path: resolve(__dirname, '../config.env') });

client.connect().then(() => {
  console.log(
    'db connected on ' + process.env.DATABASE_URI || 'mongodb://localhost:27017'
  );
  admin.listen(process.env.PORT, () => {
    console.log('listening on port: ', process.env.port);
  });
});

watchers.invitationWatcher.on(record => {
  console.log(record);
  client.insertRecord(record);
});
