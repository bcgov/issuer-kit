import {
  AgentConnectionInterface,
  AgentConnectionStatusInterface
} from "@/models/api";
import { AppConfig } from "@/models/appConfig";
import { Connection, ConnectionStatus } from "@/models/connection";
import { ConnectionState, RootState } from "@/models/storeState";
import * as ConfigService from "@/services/config";
import Axios from "axios";
import { ActionContext, ActionTree } from "vuex";

export const actions: ActionTree<ConnectionState, RootState> = {
  async getNewConnection(
    context: ActionContext<ConnectionState, RootState>
  ): Promise<Connection> {
    const config: AppConfig = await ConfigService.getAppConfig();
    return new Promise<Connection>((resolve, reject) => {
      Axios.get(`${config.apiServer.url}/connections`)
        .then(response => {
          if (response.status === 200) {
            const responseData = response.data as AgentConnectionInterface;
            const connection = new Connection();
            connection.id = responseData.connection_id;
            connection.status = ConnectionStatus.REQUEST;
            connection.invite = responseData.invitation;
            context.commit("setConnection", connection);
            resolve(connection);
          } else {
            throw "An error occurred while fetching a new connection";
          }
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  },
  async getConnectionStatus(
    context: ActionContext<ConnectionState, RootState>
  ): Promise<ConnectionStatus> {
    const config: AppConfig = await ConfigService.getAppConfig();
    return new Promise<ConnectionStatus>((resolve, reject) => {
      const id = context.getters["getConnection"].id;
      Axios.get(`${config.apiServer.url}/connections/${id}`)
        .then(response => {
          if (response.status === 200) {
            const responseData = response.data as AgentConnectionStatusInterface;
            context.commit("setStatus", responseData.state);
            resolve(responseData.state);
          } else {
            throw "An error occurred while fetching the connection status";
          }
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }
};
