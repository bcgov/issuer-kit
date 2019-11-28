import * as Router from 'koa-router';
import { Context } from 'koa';
import { IssueService } from './issue.service';
import { client } from '../../../index';

const apiUrl = process.env.AGENT_ADMIN_URL;
const issueSvc = new IssueService(apiUrl || 'http://identity-kit-agent');

export interface ICredentialPayload {
  claims: ICredentialClaims;
  connectionId: string;
  _id: string;
}

export interface ICredentialClaims {
  userdisplayname: string;
  emailaddress: string;
  surname: string;
  givenname: string;
  birthdate: string;
  age: string;
  streetaddress: string;
  locality: string;
  stateorprovince: string;
  postalcode: string;
  country: string;
}

const routerOpts = {
  prefix: '/issues',
};

const router = new Router(routerOpts);

router.post('/', async (ctx: Context) => {
  const { _id, ...data } = (ctx.request.body = ctx.request
    .body as ICredentialPayload);

  const keys = Object.keys(data.claims);
  const claims = data.claims as any;
  const mapped = keys.map(key => ({ name: key, value: claims[key] }));
  try {
    const res = await issueSvc.issueCredential({
      connId: data.connectionId,
      attrs: mapped,
    });
    if (!res) {
      console.log(
        'EXCEPTION: Failed to create credex record. Check agent status',
      );
      return ctx.throw(500, 'failed to create credential exchange record');
    }
    const record = await client.updateRecord({
      collection: 'invitations',
      query: {
        connectionId: data.connectionId,
        credExId: res.credential_exchange_id,
      },
      id: _id,
    });
    console.log('record result', record);
    ctx.body = res;
  } catch (err) {
    ctx.throw(500, 'failed to create credential exchange record');
  }
});
/*
  ID passed is credential exchange id
*/
router.get('/:id', async (ctx: Context) => {
  const id = ctx.params.id;
  const res = await client.getRecordByQuery({collection: 'invitations', query: {credExId: id}} )
  ctx.body = res;
});

export default router;
