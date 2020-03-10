import { Credential } from "@/models/credential";
import { CredentialState, RootState } from "@/models/storeState";
import { GetterTree } from "vuex";

export const getters: GetterTree<CredentialState, RootState> = {
  getCredential(state: CredentialState): Credential {
    const { credential } = state;
    return credential;
  },
  isIssued(state: CredentialState): boolean {
    const { credential } = state;
    return credential === undefined ? false : credential.isIssued;
  },
  getClaimByName(state: CredentialState, claimName: string): string {
    const { credential } = state;
    return credential === undefined
      ? ""
      : credential.claims.find(claim => claim.name === claimName)?.value || "";
  }
};
