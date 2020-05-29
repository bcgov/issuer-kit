import { IssuerInvite } from "@/models/issuer-invite";
import { IssuerInviteState, StateType } from "@/models/storeState";
import Vue from "vue";
import { MutationTree } from "vuex";

export const mutations: MutationTree<IssuerInviteState> = {
  // addIssuerInvite(state: IssuerInviteState, issuerInvite: IssuerInvite) {
  //   Vue.set(state.issuerInvite, "data", issuerInvite.data);
  //   Vue.set(state.issuerInvite, "token", issuerInvite._id);
  //   Vue.set(state.issuerInvite, "status", issuerInvite.status);
  //   state.error = false;
  //   state.statusMessage = "success";
  //   state.stateType = StateType.INITIALIZED;
  // },
  issuerInviteError(state: IssuerInviteState, errorMessage: string) {
    state.error = true;
    state.statusMessage = errorMessage;
    state.stateType = StateType.ERROR;
  },
};
