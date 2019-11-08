import { config } from 'dotenv';
import { resolve } from 'path';

import admin from './app/admin/admin';
import Router = require('koa-router');

config({ path: resolve(__dirname, '../config.env') });

admin.listen(process.env.PORT, () => {
  console.log('listening on port: ', process.env.port);
});
