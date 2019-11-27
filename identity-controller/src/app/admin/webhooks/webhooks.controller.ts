import * as Router from 'koa-router';
import { Context } from 'koa';

export interface IConnectionActivity {
  created_at: string;
  their_did: string;
  invitation_key: string;
  state: string;
  invitation_mode: string;
  accept: string;
  connection_id: string;
  my_did: string;
  initiator: string;
  request_id: string;
  updated_at: string;
  routing_state: string;
  their_label: string;
}


const routerOpts = {
  prefix: '/topic'
};

const router = new Router(routerOpts);

router.post('/connections', async (ctx: Context) => {
  const data = ctx.request.body as IConnectionActivity;
  return ctx.status = 200
});

router.post('/issue_credential', async (ctx: Context) => {
  const data = ctx.request.body;
  console.log(JSON.stringify(data, null, 2))

  // if (data.)
  return ctx.status = 200

});

router.post('/present_proof', async (ctx: Context) => {
  console.log(ctx.request.body);
  return ctx.status = 200

});

export default router;
