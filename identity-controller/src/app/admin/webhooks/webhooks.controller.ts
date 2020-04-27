import * as Router from 'koa-router';
import { Context } from 'koa';
import { ICredHookResponse } from '../../../core/interfaces/cred-hook-response.interface';
import { client } from '../../../index';
import { Connection } from '../../../core/agent-controller/modules/connection/connection.model';
import { Issue } from '../../../core/agent-controller/modules/issue/issue.model';
import { wait } from '../../../core/utility';

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
const connCtrl = new Connection();
const issueCtrl = new Issue();

router.post('/connections', async (ctx: Context) => {
  const data = ctx.request.body as IConnectionActivity;
  const { state, connection_id: connectionId } = data;
  console.info('connection hook', data);
  if (state === 'response') {
    // connCtrl.requestResponse(connectionId);
    connCtrl.sendTrustPing(connectionId);
  }
  return (ctx.status = 200);
});

router.post('/issue_credential', async (ctx: Context) => {
  const data = ctx.request.body as ICredHookResponse;

  if (data.state === 'request_received') {
    console.info('Credential has been requested', data.credential_exchange_id);
    const invitationRecord = await client.getRecordByQuery({
      collection: 'invitations',
      query: { credExId: data.credential_exchange_id },
    });
    await wait(2000);
    if (!invitationRecord) {
      console.warn(
        `${new Date().toDateString()} - No invitation found for cred_ex_id ${
          data.credential_exchange_id
        }, may be invitation-less.`,
      );
    }

    const records = await issueCtrl.records();
    const issue = await issueCtrl.filterIssueCrendentials(
      'credential_exchange_id',
      data.credential_exchange_id,
      records,
    );
    
    const attributes =
      issue[0].credential_proposal_dict.credential_proposal.attributes;
      
    const result = await issueCtrl.sendIssueById(
      data.credential_exchange_id,
      attributes,
      'issued credential',
    );
    
    if (!result) {
      console.error(
        `${new Date().toDateString()} - Failed to issue the credential, check agent status & db to ensure CredExId is correct`,
      );
      return ctx.throw(500, 'something went wrong issuing the credential');
    }

    if (invitationRecord) {
      const update = await client.updateRecord({
        collection: 'invitations',
        query: { issued: true, consumed: true },
        id: invitationRecord._id,
      });

      if (!update) {
        return console.log(
          'something went wrong saving the update to the user record',
          data.credential_exchange_id,
        );
      }
    }
  }
  if (data.state === 'credential_issued') {
    console.log('Credential has been issued', data.credential_exchange_id);
  }
  return (ctx.status = 200);
});

router.post('/present_proof', async (ctx: Context) => {
  console.log(ctx.request.body);
  return (ctx.status = 200);
});

export default router;
