export interface IInvitationRecord {
  _id?: any;
  consumed: boolean;
  method: string;
  email: string;
  jurisdiction: string;
  expiry?: Date;
  expired?: boolean;
  active: boolean;
  firstName?: string;
  lastName?: string;
  icon?: string;
  created: Date;
  changed?: boolean;
  addedBy: string;
  updatedBy?: string;
  issued?: boolean;
  linkId: string;
}
