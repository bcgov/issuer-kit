import { Context } from 'koa';
import * as Router from 'koa-router';

import { TypedEvent } from '../../../core/typed-event/typed-event.model';

import { validateInvitation } from '../../../core/validations/invitation.validation';

import watchers from '../../../core/watchers/database.watchers';

import client from '../../../core/database/database.model';

import * as uuidv1 from 'uuid/v1';
import db from '../../../core/database/database.model';

export interface IInvitationEvent {
  _id: string;
  type: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/invitation'
};

const router = new Router(routerOpts);

router.post('/', (ctx: Context) => {
  const data = ctx.request.body;
  if (!data) return ctx.throw(400, 'no data to add');
  const valid = validateInvitation(data);
  console.log(valid.errors);
  if (valid.errors) return ctx.throw(400, valid.errors.details);
  let { method, email, jurisdiction } = data;
  const uuid = uuidv1();

  watchers.invitationWatcher.emit({
    collection: 'invitations',
    action: 'insert',
    ref: uuid,
    record: {
      method,
      email,
      jurisdiction,
      consumed: false
    }
  });

  setTimeout(() => {
    return ctx.throw(500, 'operation timed out');
  }, 15000);

  db.addListener(uuid, _id => {
    return (ctx.body = uuid);
  });
});

// watcher.pipe((te) => {
//   console.log(te);
// });

export default router;
