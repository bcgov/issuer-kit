import base64url from 'base64url';
import { Context } from 'koa';
import * as Router from 'koa-router';
import { Connection } from '../../../core/agent-controller/modules/connection/connection.model';

const connection = new Connection();

const routerOpts = {
  prefix: '/connections',
};

const router = new Router(routerOpts);

router.get('/', async (ctx: Context) => {
  try {
    const invite = await connection.createInvitation();
    const base64Invite = base64url(JSON.stringify(invite.invitation));
    invite.base64 = base64Invite;
    if (!invite) return ctx.throw(404);
    return (ctx.body = invite);
  } catch (err) {
    console.log(err.message);
    return ctx.throw(500, 'no invite created. Check agent status');
  }
});

router.get('/:id', async (ctx: Context) => {
  const id = ctx.params.id;
  try {
    const res = await connection.getConnections({}, id);
    return (ctx.body = res);
  } catch {
    return ctx.throw(500);
  }
});

export default router;
