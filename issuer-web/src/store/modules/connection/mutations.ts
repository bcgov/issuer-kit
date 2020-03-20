import { Connection, ConnectionStatus } from "@/models/connection";
import { ConnectionState, StateType } from "@/models/storeState";
import Vue from "vue";
import { MutationTree } from "vuex";

export const mutations: MutationTree<ConnectionState> = {
  setConnection(state: ConnectionState, connection: Connection) {
    Vue.set(state.connection, "status", connection.status);
    Vue.set(state.connection, "id", connection.id);
    Vue.set(state.connection, "invite", connection.invite);
    state.error = false;
    state.statusMessage = "success";
    state.stateType = StateType.INITIALIZED;
  },
  setStatus(state: ConnectionState, status: ConnectionStatus) {
    Vue.set(state.connection, "status", status);
    state.error = false;
    state.statusMessage = "success";
    state.stateType = StateType.UPDATED;
  },
  connectionError(state: ConnectionState, errorMessage: string) {
    state.error = true;
    state.statusMessage = errorMessage;
    state.stateType = StateType.ERROR;
  }
};
