import { Credential } from "@/models/credential";
import { ConnectionState, RootState, StateType } from "@/models/storeState";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";
import { Connection } from "@/models/connection";

export const state: ConnectionState = {
  statusMessage: "",
  connection: new Connection(),
  error: false,
  stateType: StateType.NONE
};

const namespaced = true;

export const connection: Module<ConnectionState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
