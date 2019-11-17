import { Context } from 'koa';
import * as Router from 'koa-router';

import { validateInvitation } from '../../../core/validations/invitation.validation';

import * as uuidv1 from 'uuid/v1';
import { IInvitationRecord } from 'src/core/interfaces/invitation-record.interface';

import { client } from '../../../index';
import { ObjectId } from 'bson';

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
  const { method, email, jurisdiction } = data;

  const uuid = uuidv1();

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
    active: false,
    firstName: '',
    lastName: '',
    created: today,
    addedBy: 'wa-admin',
    guid: uuid
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
export default router;
