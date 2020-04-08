import { Credential } from "@/models/credential";
import { CredentialState, RootState, StateType } from "@/models/storeState";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: CredentialState = {
  statusMessage: "",
  credential: new Credential(),
  error: false,
  stateType: StateType.NONE
};

const namespaced = true;

export const credential: Module<CredentialState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
