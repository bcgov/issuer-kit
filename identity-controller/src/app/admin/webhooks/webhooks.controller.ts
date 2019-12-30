import * as Router from 'koa-router';
import { Context } from 'koa';
import { ICredHookResponse } from '../../../core/interfaces/cred-hook-response.interface';
import { client } from '../../../index';
import { Connection } from '../../../core/agent-controller/modules/connection/connection.model';
import { Issue } from '../../../core/agent-controller/modules/issue/issue.model';
import { wait } from '../../../core/utility'

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
  console.info('connection hook', data);
  if (state === 'response') {
    connCtrl.requestResponse(connectionId);
    connCtrl.sendTrustPing(connectionId);
  }
  return (ctx.status = 200);
});

router.post('/issue_credential', async (ctx: Context) => {
  const data = ctx.request.body as ICredHookResponse;
  
  if (data.state === 'request_received') {
    console.info('Credential has been requested', data.credential_exchange_id);
    const res = await client.getRecordByQuery({
      collection: 'invitations',
      query: { credExId: data.credential_exchange_id },
    });
    await wait(2000);
    if (!res)
      return console.error(
        `${new Date().toDateString()} - Failed to find a credential by that ID`,
        data.credential_exchange_id,
      );

    const records = await issueCtrl.records();
    const issue = await issueCtrl.filterIssueCrendentials('credential_exchange_id', data.credential_exchange_id, records);
    const attributes = issue[0].credential_proposal_dict.credential_proposal.attributes;
    const result = await issueCtrl.sendIssueById(data.credential_exchange_id, attributes, 'issued by Identity Kit POC')
    if (!result) {
      console.error(`${new Date().toDateString()} - Failed to issue the credential, check agent status & db to ensure CredExId is correct`)
      return ctx.throw(500, 'something went wrong issuing the credential')
    }

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
  if (data.state === 'issued') {
    console.log('Credential has been issued', data.credential_exchange_id);
  }
  return (ctx.status = 200);
});

router.post('/present_proof', async (ctx: Context) => {
  console.log(ctx.request.body);
  return (ctx.status = 200);
});

export default router;
