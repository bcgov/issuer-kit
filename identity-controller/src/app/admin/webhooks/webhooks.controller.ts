import * as Router from 'koa-router';
import { Context } from 'koa';

const routerOpts = {
  prefix: '/topic'
};

const router = new Router(routerOpts);

router.post('/connections', async (ctx: Context) => {
  console.log(ctx.request.body);
  return ctx.status = 200
});

router.post('/issue_credential', async (ctx: Context) => {
  console.log(ctx.request.body);
  return ctx.status = 200

});

router.post('/present_proof', async (ctx: Context) => {
  console.log(ctx.request.body);
  return ctx.status = 200

});

export default router;
