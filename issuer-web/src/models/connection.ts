export enum ConnectionState {
  REQUEST = "request",
  RESPONSE = "response",
  ACTIVE = "active"
}

export class Connection {
  public state!: ConnectionState;
  public id!: string;
  public invite!: string;
}
