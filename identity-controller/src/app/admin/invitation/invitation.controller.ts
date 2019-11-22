import { Context } from 'koa';
import * as Router from 'koa-router';

import * as uuidv4 from 'uuid/v4';

import { client } from '../../../index';
import { ObjectId } from 'bson';
import { validateInvitation } from '../../validations/invitation.validation';
import { IInvitationRecord } from '../../models/interfaces/invitation-record';

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
  const { method, email, jurisdiction, firstName = '', lastName = '' } = data;

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
    addedBy: 'wa-admin',
    linkId: uuidv4()
  } as IInvitationRecord;

  try {
    const res = await client.insertRecord<IInvitationRecord>({
      collection: 'invitations',
      record
    });
    return (ctx.body = res);
  } catch (err) {
    return ctx.throw('An internal server error occured', 500);
  } finally {
    clearTimeout(timer);
  }
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

router.get('/validate/:id', async (ctx: Context) => {});
export default router;
