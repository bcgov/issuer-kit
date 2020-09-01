import { Claim } from "./credential";

export class IssuerInvite {
  public _id!: string;
  public token!: string;
  public email!: string;
  public issued!: boolean;
  public expired!: boolean;
  public revoked?: boolean;
  public revocation_id?: string;
  public revoc_reg_id?: string;
  public created_at!: Date;
  public created_by!: string;
  public updated_at!: Date;
  public updated_by!: string;
  public data!: any; // eslint-ignore-line
  public revocation_history?: any[]; // eslint-ignore-line
}
