import { Invitation, InvitationStatus } from "@/models/invitation";
import { InvitationState, RootState } from "@/models/storeState";
import { GetterTree } from "vuex";

export const getters: GetterTree<InvitationState, RootState> = {
  getInvitation(state: InvitationState): Invitation {
    let { invitation } = state;
    if (invitation.status === InvitationStatus.UNDEFINED) {
      invitation = JSON.parse(
        localStorage.getItem("issuer-invitation") || '{ "data": { }  }'
      ) as Invitation;
    }
    return invitation;
  }
};
