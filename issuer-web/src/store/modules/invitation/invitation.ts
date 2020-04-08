import { Invitation } from "@/models/invitation";
import { InvitationState, RootState, StateType } from "@/models/storeState";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: InvitationState = {
  statusMessage: "",
  invitation: new Invitation(),
  error: false,
  stateType: StateType.NONE
};

const namespaced = true;

export const invitation: Module<InvitationState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
