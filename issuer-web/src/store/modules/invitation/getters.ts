import { Invitation } from "@/models/invitation";
import { InvitationState, RootState } from "@/models/storeState";
import { GetterTree } from "vuex";

export const getters: GetterTree<InvitationState, RootState> = {
  getInvitation(state: InvitationState): Invitation {
    const { invitation } = state;
    return invitation;
  }
};
