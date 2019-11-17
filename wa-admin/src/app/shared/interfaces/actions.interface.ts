import { IInvitationRecord } from './invitation-record.interface';

export interface IChangeAction {
  record: IInvitationRecord;
  action: ActionType;
}

export type ActionType = 'active' | 'clear';
