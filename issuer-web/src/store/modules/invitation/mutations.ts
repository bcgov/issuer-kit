import Vue from "vue";
import { InvitationState, StateType } from "@/models/storeState";
import { MutationTree } from "vuex";
import { InvitationStatus, Invitation } from "@/models/invitation";

export const mutations: MutationTree<InvitationState> = {
  setToken(state: InvitationState, token: string) {
    Vue.set(state.invitation, "token", token);
    state.error = false;
    state.statusMessage = "success";
    state.stateType = StateType.INITIALIZED;
  },
  /* eslint-disable-next-line */
  setData(state: InvitationState, data: any) {
    Vue.set(state.invitation, "data", data);
    state.error = false;
    state.statusMessage = "success";
    state.stateType = StateType.INITIALIZED;
  },
  setStatus(state: InvitationState, status: InvitationStatus) {
    Vue.set(state.invitation, "status", status);
    state.error = false;
    state.statusMessage = "success";
    state.stateType = StateType.INITIALIZED;
  },
  setInvitation(state: InvitationState, invitation: Invitation) {
    Vue.set(state.invitation, "data", invitation.data);
    Vue.set(state.invitation, "token", invitation.token);
    Vue.set(state.invitation, "status", invitation.status);
    state.error = false;
    state.statusMessage = "success";
    state.stateType = StateType.INITIALIZED;
  },
  invitationError(state: InvitationState, errorMessage: string) {
    state.error = true;
    state.statusMessage = errorMessage;
    state.stateType = StateType.ERROR;
  }
};
