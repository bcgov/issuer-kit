import { MessageState } from './agent.interface';

export type ConnectionState =
  | 'init'
  | 'invitation'
  | 'request'
  | 'response'
  | 'active'
  | 'error'
  | 'inactive';

export type RoutingState = 'none' | 'request' | 'active' | 'error';

export interface IConnectionsResult {
  my_did: string;
  inbound_connection_id: string;
  created_at: string;
  updated_at: string;
  error_msg: string;
  state: ConnectionState;
  initiator: ConnectionInitiator;
  request_id: string;
  routing_state: RoutingState;
  connection_id: string;
  their_label: string;
  accept: string;
  // This seems to be deprecated
  their_role: string;
  alias: string;
  invitation_mode: string;
  their_did: string;
  invitation_key: string;
}

export type ConnectionInitiator = 'self' | 'external';

export interface IConnectionParams {
  alias?: string;
  initiator?: string;
  invitation_key?: string;
  my_did?: string;
  state?: ConnectionState;
  their_did?: string;
  their_role?: string;
}
