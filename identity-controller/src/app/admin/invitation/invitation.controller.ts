import { Context } from 'koa';
import * as Router from 'koa-router';

import { TypedEvent } from '../../../core/typed-event/typed-event.model';

export interface IInvitationEvent {
  _id: string;
  type: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/invitation'
};

const router = new Router(routerOpts);

router.post('/', (ctx: Context) => {
  console.log('posting the thing');

  const req = ctx.body;
  watcher.emit({ _id: 'asdfs', type: 'asdfs' });
});

const watcher = new TypedEvent<IInvitationEvent>();

watcher.on(test => {
  console.log(test);
});

// watcher.pipe((te) => {
//   console.log(te);
// });

export default router;
