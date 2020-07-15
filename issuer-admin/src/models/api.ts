import { IssuerInvite } from "./issuer-invite";

export interface IssuerInviteListServiceResponse {
  total: number;
  limit: number;
  skip: number;
  data: IssuerInvite[];
}
