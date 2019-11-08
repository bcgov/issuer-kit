import { config } from 'dotenv';
import { resolve } from 'path';

import app from './app/server';
import Router = require('koa-router');

config({ path: resolve(__dirname, '../config.env') });

app.listen(process.env.PORT, () => {
  console.log('listening on port: ', process.env.port);
});
