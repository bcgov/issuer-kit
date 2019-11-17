export interface IInvitationRecord {
  _id?: any;
  consumed: boolean;
  method: string;
  email: string;
  jurisdiction: string;
  expiry?: number;
  active: boolean;
  firstName?: string;
  lastName?: string;
  icon?: string;
  created: number;
  changed?: boolean;
  addedBy: string;
}
