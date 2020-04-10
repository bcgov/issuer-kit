import { Context } from 'koa';
import * as Router from 'koa-router';
import { wait } from '../../../core/utility';
import { client } from '../../../index';
import { futureDate, IssueService } from './issue.service';
import { Issue } from '../../../core/agent-controller/modules/issue/issue.model';

export interface ICredentialPayload {
  claims: any;
  connectionId: string;
  _id: string;
}

// export interface ICredentialClaims {
//   userdisplayname: string;
//   address: string;
//   surname: string;
//   givenname: string;
//   birthdate: string;
//   age: string;
//   streetaddress: string;
//   locality: string;
//   stateorprovince: string;
//   postalcode: string;
//   country: string;
//   issued: string;
// }

const routerOpts = {
  prefix: '/issues',
};

const router = new Router(routerOpts);

router.post('/', async (ctx: Context) => {
  const { _id, ...data } = ctx.request.body as ICredentialPayload;
  data.claims.push({ name: 'issued', value: new Date().toUTCString() });

  const claims = data.claims.map((claim: any) => ({
    name: claim.name,
    value: claim.value,
    'mime-type': 'text/plain',
  }));

  console.debug(
    'Giving the mobile agent a few seconds to catch-up with the request...',
  );
  await wait(5000);

  try {
    const res = await new IssueService().issueCredential({
      connId: data.connectionId,
      attrs: claims,
    });
    if (!res) {
      console.error(
        `${new Date().toDateString()} Failed to create credex record. Check agent status`,
      );
      return ctx.throw(500, 'failed to create credential exchange record');
    }
    const expiry = futureDate(710);
    if (_id) {
      const record = await client.updateRecord({
        collection: 'invitations',
        query: {
          expiry,
          connectionId: data.connectionId,
          credExId: res.credential_exchange_id,
          issued: false,
          consumed: true,
        },
        id: _id,
      });
      if (!record) {
        console.error(
          `${new Date().toDateString()} Failed to store credex record in MongoDB.`,
        );
        return ctx.throw(500, 'failed to store credex record');
      }
    }
    ctx.body = res;
  } catch (err) {
    ctx.throw(500, 'failed to issue credential', err.text);
  }
});
/*
  ID passed is credential exchange id
  return whole object to validate the credential
*/
router.get('/:id', async (ctx: Context) => {
  const issueCtrl = new Issue();
  const cred_ex_id = ctx.params.id;
  const records = await issueCtrl.records();
  const issue = await issueCtrl.filterIssueCrendentials(
    'credential_exchange_id',
    cred_ex_id,
    records,
  );
  ctx.body = { issued: issue[0].state === 'credential_issued' };
});

export default router;
