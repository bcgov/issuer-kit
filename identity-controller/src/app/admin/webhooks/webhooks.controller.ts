import * as Router from 'koa-router';
import { Context } from 'koa';
import { ICredHookResponse } from '../../../core/interfaces/cred-hook-response.interface';
import { client } from '../../../index';

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
  prefix: '/topic',
};

const router = new Router(routerOpts);

router.post('/connections', async (ctx: Context) => {
  const data = ctx.request.body as IConnectionActivity;
  return (ctx.status = 200);
});

router.post('/issue_credential', async (ctx: Context) => {
  const data = ctx.request.body as ICredHookResponse;
  if (data.state === 'issued') {
    console.log('Credential has been store', data.credential_exchange_id);
  }
  if (data.state === 'stored') {
    console.log('Credential has been store', data.credential_exchange_id);
    const res = await client.getRecordByQuery({
      collection: 'invitations',
      query: { credExId: data.credential_exchange_id },
    });
    console.log(res);
    if (!res)
      return console.log(
        'something went wrong storing the credential',
        data.credential_exchange_id,
      );
    const update = await client.updateRecord({
      collection: 'invitations',
      query: { issued: true, consumed: true },
      id: res._id,
    });
    if (!update)
      return console.log(
        'something went wrong saving the update to the user record',
        data.credential_exchange_id,
      );
  }
  return (ctx.status = 200);
});

router.post('/present_proof', async (ctx: Context) => {
  console.log(ctx.request.body);
  return (ctx.status = 200);
});

export default router;
