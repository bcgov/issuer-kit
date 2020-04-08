import { Credential } from "@/models/credential";
import { Configuration } from "./appConfig";
import { Connection } from "./connection";
import { Invitation } from "./invitation";

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
  connection: Connection;
  statusMessage: string;
  error: any; //eslint-disable-line
  stateType: StateType;
}

export interface InvitationState {
  invitation: Invitation;
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
