import { Configuration } from "./appConfig";
import { IssuerInvite } from "./issuer-invite";

export enum StateType {
  NONE,
  INITIALIZED,
  UPDATED,
  ERROR
}

export interface RootState {
  version: string;
}

export interface IssuerInviteState {
  issuerInvites: IssuerInvite[];
  statusMessage: string;
  error: any; //eslint-disable-line
  stateType: StateType;
}

export interface ConfigurationState {
  configuration: Configuration;
  statusMessage: string;
  error: any; //eslint-disable-line
  stateType: StateType;
}
