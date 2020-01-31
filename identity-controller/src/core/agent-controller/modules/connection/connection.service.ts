import {
  IConnectionParams,
  IConnectionsResult,
} from '../../../interfaces/connection.interface';
import {
  IInvitationRequest,
  IInvitationRequestResponse,
  IReceiveInvitationRequestResponse,
} from '../../../interfaces/invitation-request.interface';
import {
  AppConfigurationService,
  APP_SETTINGS,
} from '../../../services/app-configuration-service';
import request = require('superagent');

export class ConnectionService {
  agentAdminUrl: string;
  agentAdminApiKey: string;

  readonly segment: string = 'connections';

  constructor() {
    this.agentAdminUrl = AppConfigurationService.getSetting(APP_SETTINGS.AGENT_ADMIN_URL);
    this.agentAdminApiKey = AppConfigurationService.getSetting(
      APP_SETTINGS.AGENT_ADMIN_API_KEY,
    );
  }

  /*
    create an invitation to share with another agent.
  */

  async createInvitation(): Promise<IInvitationRequestResponse> {
    console.log('api Url', this.agentAdminUrl);
    try {
      const res = await request
        .post(`${this.agentAdminUrl}/connections/create-invitation`)
        .set('Content-Type', 'application/json')
        .set('x-api-key', this.agentAdminApiKey);
      if (res.status === 200) return res.body as IInvitationRequestResponse;
      throw new Error('Create invitation failed');
    } catch (err) {
      return err;
    }
  }

  /*
    Receive an invitation from an outside source.
  */

  async receiveInvitation(
    invitation: IInvitationRequest,
    accept: boolean = true,
    params?: IConnectionParams,
  ): Promise<IReceiveInvitationRequestResponse> {
    const res = await request
      .post(`${this.agentAdminUrl}/connections/receive-invitation`)
      .send(invitation)
      .set('x-api-key', this.agentAdminApiKey);
    return res.body;
  }

  /*
    Accept an invitation by Id. Called after receiving an
    invitation from another agent.

  */

  async acceptInvitation(id: string) {
    try {
      const res = await request
        .post(`${this.agentAdminUrl}/connections/${id}/accept-invitation`)
        .set('x-api-key', this.agentAdminApiKey);

      return res.body;
    } catch (err) {
      throw new Error('accept invitation failed');
    }
  }

  /*
    Accept request responds to an invitation that has been sent to
    and accepted by another agent
  */

  async acceptRequest(id: string) {
    try {
      const res = await request
        .post(`${this.agentAdminUrl}/connections/${id}/accept-request`)
        .set('x-api-key', this.agentAdminApiKey);
      return res.body;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /*
    lists all connections. Optional parameter to list
    a specific connection.
  */

  async connections(
    id: string | null = null,
    params: IConnectionParams = {},
  ): Promise<IConnectionsResult | IConnectionsResult[]> {
    try {
      const res =
        id != null
          ? await request
              .get(`${this.agentAdminUrl}/connections/${id}`)
              .set('x-api-key', this.agentAdminApiKey)
          : await request
              .get(`${this.agentAdminUrl}/connections`)
              .set('x-api-key', this.agentAdminApiKey)
              .query(params);
      return res.body.results || res.body;
    } catch (err) {
      throw new Error('connections call failed');
    }
  }

  /*
    Assign another connection as the inbound connection
  */
  async establishInbound(id: string, refId: string) {
    return 'method not implemented';
  }

  /*

    TODO: Pull this out of the code. It simply formats an invitation for
    sending to an external agent.
  */

  /*
    send basic message to a connection (by connection id)
  */
  async sendMessage(id: string) {
    try {
      const res = await request.get(
        `${this.agentAdminUrl}/connections/${id}/send-message`,
      );
      return res.body;
    } catch (err) {
      throw err.message;
    }
  }

  /*
    Remove existing connection record. Use this to "reject" a sent connection
  */
  async sendRemoveConnection(id: string): Promise<any> {
    try {
      const url = `${this.agentAdminUrl}/${this.segment}/${id}/remove`;
      const res = await request
        .post(url)
        .set('x-api-key', this.agentAdminApiKey);
      return res.body;
    } catch (err) {
      return err;
    }
  }

  /*
    remove all connections
  */
  async removeAllConnections() {
    const connections = this.connections();
    if (Array.isArray(connections)) {
      for (const connection of connections) {
        try {
          await this.sendRemoveConnection(connection.connection_id);
        } catch (err) {
          return err;
        }
      }
    }
  }

  async postById(id: string, subsegment: 'send-ping') {
    try {
      const res = await request
        .post(`${this.agentAdminUrl}/${this.segment}/${id}/${subsegment}`)
        .send({ comment: 'Hello from identity-kit-agent' })
        .set('x-api-key', this.agentAdminApiKey);
      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
