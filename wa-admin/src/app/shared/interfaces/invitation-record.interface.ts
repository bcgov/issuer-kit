export interface IInvitationRecord {
  _id?: any;
  consumed: boolean;
  method: string;
  email: string;
  jurisdiction: string;
  expiry?: string;
  active: boolean;
  firstName?: string;
  lastName?: string;
  icon?: string;
}
