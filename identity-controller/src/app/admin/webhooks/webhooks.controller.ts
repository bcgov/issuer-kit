import * as Router from 'koa-router';
import { Context } from 'koa';
import { ICredHookResponse } from '../../../core/interfaces/cred-hook-response.interface';
import { client } from '../../../index';
import { Connection } from '../../../core/agent-controller/modules/connection/connection.model';
import { Issue } from '../../../core/agent-controller/modules/issue/issue.model';

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

const connCtrl = new Connection(
  process.env.AGENT_ADMIN_URL || 'http://localhost:8024/',
);
const issueCtrl = new Issue(
  process.env.AGENT_ADMIN_URL || 'http://localhost:8024/',
);

router.post('/connections', async (ctx: Context) => {
  const data = ctx.request.body as IConnectionActivity;
  const { state, connection_id: connectionId } = data;
  if (state === 'response') {
    connCtrl.requestResponse(connectionId);
    connCtrl.sendTrustPing(connectionId);
  }
  return (ctx.status = 200);
});

router.post('/issue_credential', async (ctx: Context) => {
  const data = ctx.request.body as ICredHookResponse;
  console.log(data);
  if (data.state === 'request_received') {
    console.info('Credential has been requested', data.credential_exchange_id);
    const res = await client.getRecordByQuery({
      collection: 'invitations',
      query: { credExId: data.credential_exchange_id },
    });
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
    // issueCtrl.sendIssueById(data.credential_exchange_id)

    if (!update)
      return console.log(
        'something went wrong saving the update to the user record',
        data.credential_exchange_id,
      );
  }
  if (data.state === 'issued') {
    console.log('Credential has been issued', data.credential_exchange_id);
  }
  /*
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
  */
  return (ctx.status = 200);
});

router.post('/present_proof', async (ctx: Context) => {
  console.log(ctx.request.body);
  return (ctx.status = 200);
});

export default router;
