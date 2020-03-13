import { AgentInvitationInterface } from "./api";

export enum ConnectionStatus {
  UNDEFINED,
  REQUEST = "request",
  RESPONSE = "response",
  ACTIVE = "active"
}

export class Connection {
  public status = ConnectionStatus.UNDEFINED;
  public id!: string;
  public invite!: AgentInvitationInterface;
}
