import { TypedEvent } from '../typed-event/typed-event.model';
import db, { IInvitationRecord } from '../database/database.model';

export interface IDBInsert<T> {
  collection: 'invitations';
  action: 'insert';
  ref: string;
  record: T;
}

const invitationWatcher = new TypedEvent<IDBInsert<IInvitationRecord>>();

export default { invitationWatcher };
