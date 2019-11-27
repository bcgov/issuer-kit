import { TypedEvent } from '../../app/models/typed-event/typed-event.model';
import { IInvitationRecord } from '../../app/models/interfaces/invitation-record';

export interface IDBInsert<T> {
  collection: 'invitations';
  action: 'insert';
  ref: string;
  record: T;
}

const invitationWatcher = new TypedEvent<IDBInsert<IInvitationRecord>>();

export default { invitationWatcher };
