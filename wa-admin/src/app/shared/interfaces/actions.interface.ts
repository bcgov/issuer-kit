import { IInvitationRecord } from './invitation-record.interface';

export interface IChangeAction {
  record: IInvitationRecord;
  action: ActionType;
}

export type ActionType = 'active' | 'clear' | 'email' | 'revoke';

export interface IActionMenuItem {
  label: string;
  key: ActionType;
}
