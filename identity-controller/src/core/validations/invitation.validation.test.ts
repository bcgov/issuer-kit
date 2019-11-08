import test from 'ava';
import * as Joi from '@hapi/joi';

import { validateInvitation } from './invitation.validation';

const prefix = 'VALIDATORS: ';
test(prefix + 'validate invitations', t => {
  const obj = {
    email: 'xyz@example.com',
    method: 'github',
    jurisdiction: 'BC'
  };
  const result = validateInvitation(obj);
  t.assert(result.errors === undefined);
});
