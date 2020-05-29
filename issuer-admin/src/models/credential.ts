export interface Claim {
  name: string;
  value: string;
}

export class Credential {
  public isIssued = false;
  public claims: Array<Claim> = new Array<Claim>();
}
