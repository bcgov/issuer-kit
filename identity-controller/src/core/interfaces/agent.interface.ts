export type MessageState = 'active' | 'inactive' | 'response' | 'invitation';

export interface IConnection {
  connectionId: string;
  state: MessageState;
}

export interface IBasicMessage {
  content: string;
}

export interface IInvitation {
  type: string;
  routingKeys: string[];
  id: string;
  serviceEndpoint: string;
  imageUrl: string;
  did: string;
  recipientKeys: string[];
  label: string;
}

export interface ICreateInvitation {
  invitation: IInvitation;
  connection_id: string;
  invitation_url: string;
}
