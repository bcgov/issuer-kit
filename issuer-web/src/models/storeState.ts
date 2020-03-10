import { Credential } from "@/models/credential";

export enum StateType {
  NONE,
  INITIALIZED,
  UPDATED,
  ERROR
}

export interface RootState {
  version: string;
}

export interface CredentialState {
  credential: Credential;
  statusMessage: string;
  error: any; //eslint-disable-line
  stateType: StateType;
}

export interface ConnectionState {
  credential: Credential;
  statusMessage: string;
  error: any; //eslint-disable-line
  stateType: StateType;
}
