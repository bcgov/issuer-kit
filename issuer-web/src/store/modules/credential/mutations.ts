import Vue from "vue";
import { CredentialState, StateType } from "@/models/storeState";
import { MutationTree } from "vuex";
import { Claim } from "@/models/credential";

export const mutations: MutationTree<CredentialState> = {
  setIssued(state: CredentialState) {
    Vue.set(state.credential, "isIssued", true);
    state.error = false;
    state.statusMessage = "success";
    state.stateType = StateType.UPDATED;
  },
  updateClaims(state: CredentialState, claims: Claim[]) {
    const claimSet = state.credential.claims;
    claims.forEach(claim => {
      const updateIndex = claimSet.findIndex(item => claim.name === item.name);
      if (updateIndex > -1) {
        claimSet.splice(updateIndex, 1, claim);
      } else {
        claimSet.push(claim);
      }
    });
    Vue.set(state.credential, "claims", claimSet);
    state.error = false;
    state.statusMessage = "success";
    state.stateType = StateType.UPDATED;
  },
  credentialError(state: CredentialState, errorMessage: string) {
    state.error = true;
    state.statusMessage = errorMessage;
    state.stateType = StateType.ERROR;
  }
};
