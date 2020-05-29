import { IssuerInvite } from "./issuer-invite";

export interface IssuerInviteServiceResponse {
  total: number;
  limit: number;
  skip: number;
  data: IssuerInvite[];
}
