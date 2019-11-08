import { Context } from 'koa';
import * as Router from 'koa-router';

import { TypedEvent } from '../../../core/typed-event/typed-event.model';

import { validateInvitation } from '../../../core/validations/invitation.validation';

import watchers from '../../../core/watchers/database.watchers';

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

  watchers.invitationWatcher.emit({
    collection: 'invitations',
    action: 'insert',
    record: {
      method,
      email,
      jurisdiction,
      created: new Date(),
      consumed: false
    }
  });
});

const watcher = new TypedEvent<IInvitationEvent>();

watcher.on(test => {
  console.log(test);
});

// watcher.pipe((te) => {
//   console.log(te);
// });

export default router;
