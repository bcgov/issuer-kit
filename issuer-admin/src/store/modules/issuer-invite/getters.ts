import { IssuerInvite } from "@/models/issuer-invite";
import { IssuerInviteState, RootState } from "@/models/storeState";
import { GetterTree } from "vuex";

export const getters: GetterTree<IssuerInviteState, RootState> = {
  getInvites(state: IssuerInviteState): IssuerInvite[] {
    const { issuerInvites } = state;
    return issuerInvites;
  }
};
