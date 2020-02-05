import { Context } from 'koa';
import * as Router from 'koa-router';
import * as uuidv4 from 'uuid/v4';
import {
  AppConfigurationService,
  APP_SETTINGS,
} from '../../../core/services/app-configuration-service';
import { client } from '../../../index';
import { IInvitationRecord } from '../../models/interfaces/invitation-record';
import { EmailService } from '../../services/email.service';
import { validateInvitation } from '../../validations/invitation.validation';
import { InvitationService } from './invitation.service';

const publicUrl = AppConfigurationService.getSetting(
  APP_SETTINGS.PUBLIC_SITE_URL,
);

const emailSvc = new EmailService({
  host: AppConfigurationService.getSetting(APP_SETTINGS.SMTP_HOST),
  port: Number(AppConfigurationService.getSetting(APP_SETTINGS.SMTP_PORT)),
  user: AppConfigurationService.getSetting(APP_SETTINGS.SMTP_USERNAME),
  pass: AppConfigurationService.getSetting(APP_SETTINGS.SMTP_PASS),
});

const invitationSvc = new InvitationService();

export interface IInvitationEvent {
  _id: string;
  type: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/invitations',
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
    lastName = '',
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
    linkId: uuidv4(),
  } as IInvitationRecord;
  try {
    const exists = await client.getRecordByQuery({
      collection: 'invitations',
      query: { email },
    });
    if (exists != null) {
      ctx.throw(400, `User with email ${email} already exists`);
    }
    const res = await client.insertRecord<IInvitationRecord>({
      collection: 'invitations',
      record,
    });
    if (!res) ctx.throw(500, 'user failed to add');

    ctx.body = res;

    if (publicUrl.match('localhost')) {
      // development mode
      ctx.throw(500, `Running in development mode: to use the invite, go to </br> ${publicUrl}/validate?invite_token=${res.linkId}`);
    }

    const mail = await emailSvc.mailInvite({
      address: res.email,
      url: `${publicUrl}/validate?invite_token=${res.linkId}`,
    });
    if (!mail) {
      console.log('email failed to send', res.email);

      ctx.throw(
        500,
        `The invite email to ${email} could not be sent. If you expected the email to work please check your SMTP settings.<br/>
         To use this invite, navigate to: ${publicUrl}/validate?invite_token=${res.linkId}`,
      );
    }
  } catch (err) {
    console.log('an error occurred adding the user', err);
    ctx.throw(err.status, err.message);
  } finally {
    clearTimeout(timer);
  }
});

router.post('/:id/request', async (ctx: Context) => {
  const linkId = ctx.params.id;
  const { email } = ctx.request.body;
  try {
    await invitationSvc.requestToken({ email, linkId, emailSvc, client });
  } catch (err) {
    console.exception(err);
  }
  return (ctx.body = 200);
});

router.get('/:id/validate/', async (ctx: Context) => {
  const linkId = ctx.params.id;
  const res = await invitationSvc.validateToken(linkId, client);
  ctx.body = res;
});

router.post('/:id/renew/', async (ctx: Context) => {
  const id = ctx.params.id;
  const { updatedBy } = ctx.request.body;
  const today = new Date();
  const expiry = new Date();
  expiry.setDate(today.getDate() + 1);
  const linkId = uuidv4();
  const res = await client.updateRecord<any>({
    collection: 'invitations',
    query: {
      linkId,
      expiry,
      updatedBy,
      updatedAt: new Date(),
    },
    id,
  });
  ctx.body = res.result;
  const user = await client.getRecord({ collection: 'invitations', id });
  const mail = await emailSvc.mailInvite({
    address: user.email,
    url: `${publicUrl}/validate?invite_token=${linkId}`,
  });
  if (!mail) {
    console.log('email failed to send', res.email);

    ctx.throw(
      500,
      `${res.email} did not receive an e-mail invitation due to an internal server error.`,
    );
  }
});

router.post('/:id/revoke/', async (ctx: Context) => {
  const id = ctx.params.id;
  const { updatedBy } = ctx.request.body;

  const record = await client.getRecord({ collection: 'invitations', id });
  if (!record) return ctx.throw(404);
  const active = !record.active;
  const expiry = new Date();
  const res = await client.updateRecord<any>({
    collection: 'invitations',
    query: {
      expiry,
      active,
      updatedBy,
      updatedAt: new Date(),
    },
    id,
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
