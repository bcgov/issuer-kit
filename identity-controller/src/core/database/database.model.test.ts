import test from 'ava';
import * as Joi from '@hapi/joi';

import db from './database.model';

const prefix = 'VALIDATORS: ';
test(prefix + 'validate invitations', t => {
  db.connect();
  // t.is(result.value, obj);
});
