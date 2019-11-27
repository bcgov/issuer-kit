import { Context } from 'koa';
import * as Router from 'koa-router';

import * as uuidv4 from 'uuid/v4';

import { client } from '../../../index';
import { ObjectId } from 'bson';
import { validateInvitation } from '../../validations/invitation.validation';
import { IInvitationRecord } from '../../models/interfaces/invitation-record';
import { EmailService } from '../../services/email.service';

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '2525');
const user = process.env.SMTP_USERNAME;
const pass = process.env.SMTP_PASS;
const publicUrl = process.env.PUBLIC_URL;

const emailSvc = new EmailService({
  host: host || '',
  port,
  user: user || '',
  pass: pass || ''
});

export interface IInvitationEvent {
  _id: string;
  type: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/invitations'
};

const router = new Router(routerOpts);
router.get('/', async (ctx: Context) => {
  const params = ctx.request.querystring;
  console.log(params);
  const timer = setTimeout(() => {
    return ctx.throw(500, 'operation timed out');
  }, 5000);
  try {
    const records = await client.getRecords('invitations');
    return (ctx.body = records);
  } catch (err) {
    return ctx.throw(500, err.message);
  } finally {
    clearTimeout(timer);
  }
});
router.post('/', async (ctx: Context) => {
  const data = ctx.request.body;
  if (!data) return ctx.throw(400, 'no data to add');
  const valid = validateInvitation(data);
  if (valid.errors) return ctx.throw(400, valid.errors.details);
  const {
    method,
    email,
    jurisdiction,
    addedBy,
    firstName = '',
    lastName = ''
  } = data;

  const timer = setTimeout(() => {
    return ctx.throw(500, 'operation timed out');
  }, 5000);

  const today = new Date();
  const expiry = new Date();
  expiry.setDate(today.getDate() + 1);
  const record = {
    method,
    email,
    jurisdiction,
    consumed: false,
    expiry: expiry,
    active: true,
    firstName,
    lastName,
    created: today,
    addedBy,
    linkId: uuidv4()
  } as IInvitationRecord;
  try {
    const res = await client.insertRecord<IInvitationRecord>({
      collection: 'invitations',
      record
    });

    ctx.body = res;

    try {
      const mail = await emailSvc.mailInvite({
        address: res.email,
        url: `${publicUrl}validate?invite_token=${res.linkId}`
      });
    } catch (err) {
      ctx.throw(500, 'failed to send email to ' + res.email);
    }
  } catch (err) {
    return ctx.throw('An internal server error occured', 500);
  } finally {
    clearTimeout(timer);
  }
});

router.get('/:id/validate/', async (ctx: Context) => {
  const linkId = ctx.params.id;
  const res = await client.getRecordByQuery({
    collection: 'invitations',
    query: { linkId }
  });
  if (!res) return ctx.throw(404);
  return (ctx.status = 200);
});

router.post('/:id/renew/', async (ctx: Context) => {
  const id = ctx.params.id;
  const today = new Date();
  const expiry = new Date();
  expiry.setDate(today.getDate() + 1);
  const res = await client.updateRecord<any>({
    collection: 'invitations',
    query: {
      linkId: uuidv4(),
      expiry,
      updatedBy: 'wa-admin',
      updatedAt: new Date()
    },
    id
  });
  ctx.body = res;
});

router.get('/:id', async (ctx: Context) => {
  const id = ctx.params.id;

  try {
    const record = await client.getRecord({ collection: 'invitations', id });
    return (ctx.body = record);
  } catch (err) {
    return ctx.throw(err.message);
  }
});

export default router;
