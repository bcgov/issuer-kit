import { IssuerInvite } from "@/models/issuer-invite";
import { IssuerInviteState, RootState, StateType } from "@/models/storeState";
import { Module } from "vuex";
import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

export const state: IssuerInviteState = {
  statusMessage: "",
  issuerInvites: new Array<IssuerInvite>(),
  error: false,
  stateType: StateType.NONE,
};

const namespaced = true;

export const issuerInvite: Module<IssuerInviteState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
