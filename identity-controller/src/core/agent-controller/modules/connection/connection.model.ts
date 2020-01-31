import {
  IConnectionParams,
  IConnectionsResult,
} from '../../../interfaces/connection.interface';
import {
  IAcceptApplicationRequestResponse,
  IInvitation,
  IInvitationRequestResponse,
  IReceiveInvitationRequestResponse,
} from '../../../interfaces/invitation-request.interface';
import { ConnectionService } from './connection.service';

export class Connection {
  private connectionSvc: ConnectionService;

  formatInvitation(body: IInvitationRequestResponse) {
    const invitation = {
      '@type': body.invitation['@type'],
      '@id': body.invitation['@id'],
      serviceEndpoint: body.invitation.serviceEndpoint,
      label: body.invitation.label,
      recipientKeys: body.invitation.recipientKeys,
    };
    return invitation;
  }

  constructor() {
    this.connectionSvc = new ConnectionService();
  }

  /*
    Get all connections or enter an id to get a specific connection
  */
  async getConnections(
    params: IConnectionParams = {},
    id?: string | null,
  ): Promise<IConnectionsResult | IConnectionsResult[]> {
    try {
      const res = id
        ? await this.connectionSvc.connections(id, params)
        : await this.connectionSvc.connections(null, params);
      return res;
    } catch (err) {
      return err;
    }
  }

  async createInvitation(): Promise<any> {
    try {
      const res = await this.connectionSvc.createInvitation();
      return res;
    } catch (err) {
      return err;
    }
  }

  /*
    respond to an invitation. 
    Setting autoAccept to true ** deprecated ** will automatically accept the invitation
    You can optionally choose to reject it by setting accept to be false.
  */

  async invitationResponse(
    invitation: IInvitation,
    autoAccept: boolean = true,
    accept?: boolean,
  ): Promise<IReceiveInvitationRequestResponse> {
    try {
      const res = await this.connectionSvc.receiveInvitation(
        invitation,
        autoAccept,
      );
      return res;
    } catch (err) {
      console.log('invitation response failed');
      return err;
    }
  }

  async acceptInvitation(
    id: string,
    accept = true,
  ): Promise<IAcceptApplicationRequestResponse> {
    try {
      const res = await this.connectionSvc.acceptInvitation(id);
      return res;
    } catch (err) {
      return err;
    }
  }

  async requestResponse(id: string, accept = true) {
    if (accept) {
      try {
        let res = await this.connectionSvc.acceptRequest(id);
        return res;
      } catch (err) {
        return err;
      }
    }
    try {
      let res = await this.connectionSvc.sendRemoveConnection(id);
      return 'removed';
    } catch (err) {
      return err;
    }
  }
  async removeAllConnections() {
    try {
      let connections = await this.connectionSvc.connections();
      if (Array.isArray(connections)) {
        for (let connection of connections) {
          await this.removeConnection(connection.connection_id);
        }
      }
      return;
    } catch (err) {
      return err;
    }
  }

  async removeConnection(id: string) {
    try {
      const res = await this.connectionSvc.sendRemoveConnection(id);
      return res;
    } catch (err) {
      return err;
    }
  }

  async sendTrustPing(id: string) {
    try {
      let res = await this.connectionSvc.postById(id, 'send-ping');
      if (res.status === 200) return res.body;
      else throw new Error(`trust ping failed with status: ${res.status}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
