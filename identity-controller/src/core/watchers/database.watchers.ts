import { TypedEvent } from '../typed-event/typed-event.model';
import { IInvitationRecord } from '../interfaces/invitation-record.interface';

export interface IDBInsert<T> {
  collection: 'invitations';
  action: 'insert';
  ref: string;
  record: T;
}

const invitationWatcher = new TypedEvent<IDBInsert<IInvitationRecord>>();

export default { invitationWatcher };
