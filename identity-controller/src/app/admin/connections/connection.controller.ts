import * as Router from 'koa-router';
import { Context } from 'koa';
import { Connection } from '../../../core/agent-controller/modules/connection/connection.model';
import base64url from 'base64url';

const apiUrl = process.env.AGENT_ADMIN_URL;

console.log('api Url', apiUrl);

const connection = new Connection(apiUrl || '');

const routerOpts = {
  prefix: '/connections',
};

const router = new Router(routerOpts);

router.get('/', async (ctx: Context) => {
  try {
    const invite = await connection.createInvitation();
    const baseInvite = base64url(JSON.stringify(invite.invitation));
    invite.base = baseInvite;
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
