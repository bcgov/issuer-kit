import { Context } from 'koa';
import * as Router from 'koa-router';

const routerOpts = { prefix: '/health' };

const router = new Router(routerOpts);

router.get('/', async (ctx: Context) => {
  return (ctx.status = 200);
});

export default router;
