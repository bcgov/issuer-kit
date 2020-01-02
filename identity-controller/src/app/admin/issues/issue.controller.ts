import * as Router from 'koa-router';
import { Context } from 'koa';
import { IssueService, futureDate } from './issue.service';
import { client } from '../../../index';
import { wait } from '../../../core/utility'

const apiUrl = process.env.AGENT_ADMIN_URL;
const issueSvc = new IssueService(apiUrl || 'http://identity-kit-agent');

export interface ICredentialPayload {
  claims: ICredentialClaims;
  connectionId: string;
  _id: string;
}

export interface ICredentialClaims {
  userdisplayname: string;
  address: string;
  surname: string;
  givenname: string;
  birthdate: string;
  age: string;
  streetaddress: string;
  locality: string;
  stateorprovince: string;
  postalcode: string;
  country: string;
  issued: string;
}

const routerOpts = {
  prefix: '/issues',
};

const router = new Router(routerOpts);

router.post('/', async (ctx: Context) => {
  const { _id, ...data } = ctx.request.body as ICredentialPayload;
  data.claims.issued = new Date().toUTCString();

  const keys = Object.keys(data.claims);
  const claims = data.claims as any;
  const mapped = keys.map(key => ({
    name: key,
    value: claims[key],
    'mime-type': 'text/plain',
  }));

  console.log('start break');

  await wait(5000);
  console.log('end break');
  try {
    const res = await issueSvc.issueCredential({
      connId: data.connectionId,
      attrs: mapped,
    });
    if (!res) {
      console.error(
        `${new Date().toDateString()} Failed to create credex record. Check agent status`,
      );
      return ctx.throw(500, 'failed to create credential exchange record');
    }
    const expiry = futureDate(710);
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
    ctx.body = res;
  } catch (err) {
    ctx.throw(500, 'failed to create credential exchange record', err.text);
  }
});
/*
  ID passed is credential exchange id
  return whole object to validate the credential
*/
router.get('/:id', async (ctx: Context) => {
  const id = ctx.params.id;
  const res = await client.getRecordByQuery({
    collection: 'invitations',
    query: { credExId: id },
  });
  ctx.body = res;
});

export default router;
