import { ConnectionStatus } from './connection';

export interface IssuerInvitationInterface {
  token: string;
  expired?: boolean;
  issued?: boolean;
  data?: {};
}

export interface AgentConnectionInterface {
  connection_id: string;
  invitation: AgentInvitationInterface;
  invitation_url: string;
  base64: string;
}

export interface AgentInvitationInterface {
  "@type": string;
  "@id": string;
  serviceEndpoint: string;
  recipientKeys?: string[] | null;
  label: string;
}

export interface AgentConnectionStatusInterface {
  invitation_mode: string;
  state: ConnectionStatus;
  invitation_key: string;
  accept: string;
  routing_state: string;
  created_at: string;
  updated_at: string;
  connection_id: string;
  initiator: string;
}
