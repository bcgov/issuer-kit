import admin from './app/admin/admin';
import Router = require('koa-router');

import { DBClient } from './core/database/database.model';
import watchers from './core/watchers/database.watchers';

let dbOptions = {
  uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVICE}:${process.env.DB_PORT}/${process.env.DB_NAME}`
};

export const client = DBClient.getInstance(dbOptions);

client.connect().then(() => {
  console.log(`DB connected on ${dbOptions.uri}`);
  admin.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
  });
});

watchers.invitationWatcher.on(record => {
  // console.log(record);
  client.insertRecord(record);
});
