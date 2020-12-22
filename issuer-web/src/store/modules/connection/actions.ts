import {
  AgentConnectionInterface,
  AgentConnectionStatusInterface
} from "@/models/api";
import { Configuration } from "@/models/appConfig";
import { Connection, ConnectionStatus } from "@/models/connection";
import { ConnectionState, RootState } from "@/models/storeState";
import Axios, { CancelToken } from "axios";
import { ActionContext, ActionTree } from "vuex";
import { sleep } from "@/utils";

export const actions: ActionTree<ConnectionState, RootState> = {
  async getNewConnection(
    context: ActionContext<ConnectionState, RootState>
  ): Promise<Connection> {
    const config = context.rootGetters[
      "configuration/getConfiguration"
    ] as Configuration;
    return new Promise<Connection>((resolve, reject) => {
      Axios.post(`${config.app.apiServer.url}/connection`)
        .then(response => {
          if (response.status === 201) {
            const responseData = response.data as AgentConnectionInterface;
            const connection = new Connection();
            connection.id = responseData.connection_id;
            connection.status = ConnectionStatus.REQUEST;
            connection.invite = responseData.invitation;
            context.commit("setConnection", connection);
            resolve(connection);
          } else {
            throw new Error(
              "An error occurred while fetching a new connection"
            );
          }
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  },
  async waitForConnectionStatus(
    context: ActionContext<ConnectionState, RootState>,
    options: { status: ConnectionStatus[]; cancelToken: CancelToken }
  ): Promise<ConnectionStatus> {
    const config = context.rootGetters[
      "configuration/getConfiguration"
    ] as Configuration;
    return new Promise<ConnectionStatus>((resolve, reject) => {
      const id = context.getters["getConnection"].id;
      const retryInterceptor = Axios.interceptors.response.use(
        async response => {
          const responseData = response.data as AgentConnectionStatusInterface;
          if (
            !response.config.url?.match(
              `${config.app.apiServer.url}/connection/${id}`
            )
          ) {
            return response;
          } else if (options.status.indexOf(responseData.state) > -1) {
            return response;
          } else {
            // retry every 500ms until the credential has not been issued
            await sleep(500);
            return Axios.request(response.config);
          }
        },
        error => {
          // Any status codes that falls outside the range of 2xx cause this function to trigger
          console.log("An error occurred while fetching the connection status");
          return Promise.reject(error);
        }
      );
      Axios.get(`${config.app.apiServer.url}/connection/${id}`, {
        cancelToken: options.cancelToken
      })
        .then(response => {
          if (response.status === 200) {
            const responseData = response.data as AgentConnectionStatusInterface;
            context.commit("setStatus", responseData.state);
            resolve(responseData.state);
          } else {
            throw new Error(
              "An error occurred while fetching the connection status"
            );
          }
        })
        .catch(error => {
          console.error(error);
          reject(error);
        })
        .finally(() => {
          Axios.interceptors.response.eject(retryInterceptor);
        });
    });
  }
};
