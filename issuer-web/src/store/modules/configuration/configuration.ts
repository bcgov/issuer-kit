import { Configuration } from "@/models/appConfig";
import { ConfigurationState, RootState, StateType } from "@/models/storeState";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: ConfigurationState = {
  statusMessage: "",
  configuration: new Configuration(),
  error: false,
  stateType: StateType.NONE
};

const namespaced = true;

export const configuration: Module<ConfigurationState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
