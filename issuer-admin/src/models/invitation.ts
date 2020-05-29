export enum InvitationStatus {
  UNDEFINED,
  VALID,
  INVALID,
  EXPIRED,
  USED
}

export class Invitation {
  public status: InvitationStatus = InvitationStatus.UNDEFINED;
  public token!: string;
  public data!: any; // eslint-disable-line
}
