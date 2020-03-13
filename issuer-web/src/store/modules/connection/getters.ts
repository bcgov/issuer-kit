import { Connection, ConnectionStatus } from "@/models/connection";
import { ConnectionState, RootState } from "@/models/storeState";
import { GetterTree } from "vuex";

export const getters: GetterTree<ConnectionState, RootState> = {
  getConnection(state: ConnectionState): Connection {
    const { connection } = state;
    return connection;
  },
  getConnectionStatus(state: ConnectionState): ConnectionStatus {
    const { connection } = state;
    return connection.status;
  }
};
