import {
  RoutingState,
  ConnectionInitiator,
  ConnectionState
} from './connection.interface';

export interface IInvitation {
  '@type': string;
  '@id': string;
  recipientKeys: string[];
  label: string;
  serviceEndpoint: string;
}

export interface IInvitationRequestResponse {
  connection_id: string;
  invitation: IInvitation;
  invitation_url: string;
}

export interface IReceiveInvitationRequestResponse {
  created_at: string;
  connection_id: string;
  state: ConnectionState;
  initiator: ConnectionInitiator;
  invitation_key: string;
  updated_at: string;
  their_label: string;
  invitation_mode: string;
  accept: string;
  routing_state: RoutingState;
}

export interface IAcceptApplicationRequestResponse {
  their_did: string;
  initiator: string;
  inbound_connection_id: string;
  invitation_key: string;
  their_role: ConnectionInitiator;
  invitation_mode: string;
  their_label: string;
  accept: string;
  routing_state: RoutingState;
  state: ConnectionState;
  error_msg: string;
  alias: string;
  request_id: string;
  my_did: string;
  updated_at: string;
  created_at: string;
  connection_id: string;
}

export interface IInvitationRequest {
  '@type': string;
  '@id': string;
  serviceEndpoint: string;
  label: string;
  recipientKeys: string[];
}

export interface IConnection {
  connection_id: string;
  updated_at: string;
  request_id: string;
  initiator: string;
  accept: string;
  invitation_key: string;
  routing_state: string;
  my_did: string;
  created_at: string;
  their_label: string;
  state: string;
  invitation_mode: string;
  activity: IConnectionActivity[];
}

export interface IConnectionActivity {
  id: string;
  meta: string;
  time: string;
  type: string;
  direction: string;
  connection_id: string;
}

export interface IAcceptRequestResponse {
  routing_state: string;
  accept: string;
  updated_at: string;
  created_at: string;
  my_did: string;
  their_did: string;
  invitation_mode: string;
  state: ConnectionState;
  invitation_key: string;
  initiator: ConnectionInitiator;
  connection_id: string;
  their_label: string;
}
