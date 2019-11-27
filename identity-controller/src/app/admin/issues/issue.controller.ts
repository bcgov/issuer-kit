import * as Router from 'koa-router';
import { Context } from 'koa';
import { IssueService } from './issue.service';

const apiUrl = process.env.AGENT_ADMIN_URL;
const issueSvc = new IssueService(apiUrl || 'http://identity-kit-agent');

export interface ICredentialPayload {
  claims: ICredentialClaims;
  connectionId: string;
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
  prefix: '/issues'
};

const router = new Router(routerOpts);

router.post('/', async (ctx: Context) => {
  const data = ctx.request.body as ICredentialPayload;
  const keys = Object.keys(data.claims);
  const claims = data.claims as any;
  const mapped = keys.map(key => ({ name: key, value: claims[key] }));

  const res = await issueSvc.issueCredential({
    connId: data.connectionId,
    attrs: mapped
  });
  ctx.body = res;
});

router.get('/:id', async (ctx: Context) => {
  const id = ctx.params.id;
  const res = await issueSvc.credentialStatus(id);
  console.log(res);
  ctx.body = res;
});

export default router;
