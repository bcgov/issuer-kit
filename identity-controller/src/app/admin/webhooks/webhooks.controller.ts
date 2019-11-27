import * as Router from 'koa-router';
import { Context } from 'koa';

const routerOpts = {
  prefix: '/topic'
};

const router = new Router(routerOpts);

router.post('/connections', async (ctx: Context) => {
  console.log(ctx.body);
});

router.post('/issue_credential', async (ctx: Context) => {
  console.log(ctx.body);
});

router.post('/present_proof', async (ctx: Context) => {
  console.log(ctx.body);
});

export default router;
