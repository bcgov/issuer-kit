export interface IssuerInvitationInterface {
  _id: string;
  expired: boolean;
  active: boolean;
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
