import { Claim } from "./credential";

export class IssuerInvite {
  public _id!: string;
  public token!: string;
  public email!: string;
  public issued!: boolean;
  public expired!: boolean;
  public created_at!: Date;
  public created_by!: string;
  public updated_at!: Date;
  public updated_by!: string;
  public data!: any; //eslint-ignore-line
}
