import config from "@/assets/config/config.json";
import { AgentConnectionInterface } from "@/models/api";
import { Connection, ConnectionStatus } from "@/models/connection";
import { ConnectionState, RootState } from "@/models/storeState";
import store from "@/store";
import Axios from "axios";
import { ActionTree } from "vuex";

export const actions: ActionTree<ConnectionState, RootState> = {
  getNewConnection() {
    return new Promise<Connection>(resolve => {
      Axios.get(`${config.apiServer.url}/connections`)
        .then(response => {
          if (response.status === 200) {
            const responseData = response.data as AgentConnectionInterface;
            const connection = new Connection();
            connection.id = responseData.connection_id;
            connection.status = ConnectionStatus.REQUEST;
            connection.invite = responseData.invitation;
            store.commit("connection/setConnection", connection);
            resolve(connection);
          } else {
            throw "An error occurred while fetching a new connection";
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }
  // getConnectionStatus(context: ActionContext<ConnectionState, RootState>) {
  //   return new Promise<ConnectionStatus>(resolve => {});
  // },
  // setConnectionStatus(context: ActionContext<ConnectionState, RootState>) {
  //   return new Promise<ConnectionStatus>(resolve => {});
  // }
};
