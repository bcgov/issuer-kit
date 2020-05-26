import { IssuerInvitationInterface } from "@/models/api";
import { AppConfig } from "@/models/appConfig";
import { Invitation, InvitationStatus } from "@/models/invitation";
import { InvitationState, RootState } from "@/models/storeState";
import * as ConfigService from "@/services/config";
import Axios from "axios";
import { Route } from "vue-router";
import { ActionContext, ActionTree } from "vuex";

function getInviteStatus(inviteData: {
  issued: boolean;
  expired: boolean;
}): InvitationStatus {
  let status;
  if (!inviteData.issued && !inviteData.expired) {
    status = InvitationStatus.VALID;
  } else if (inviteData.expired) {
    status = InvitationStatus.EXPIRED;
  }
  return status || InvitationStatus.UNDEFINED;
}

export const actions: ActionTree<InvitationState, RootState> = {
  async isValidToken(
    context: ActionContext<InvitationState, RootState>,
    route: Route
  ) {
    // This action can be called BEFORE the Vue store is initialized and the config is loaded,
    // so we need to fetch the configuration to be sure we have it.
    const config: AppConfig = await ConfigService.getAppConfig();
    return new Promise<boolean>(resolve => {
      let isValid = false;
      const token = route.query.invite_token as string;
      const invitation = new Invitation();

      if (!token) {
        // no token was provided
        invitation.status = InvitationStatus.INVALID;
        context.commit("setStatus", InvitationStatus.INVALID);
        resolve(false);
      } else {
        // check token validity
        Axios.post(`${config.apiServer.url}/token/${token}/validate`).then(
          response => {
            const responseData = response.data as IssuerInvitationInterface;
            const invitationStatus = getInviteStatus({
              issued: responseData.issued || false,
              expired: responseData.expired || false
            });
            invitation.status = invitationStatus;
            if (InvitationStatus.VALID === invitationStatus) {
              invitation.token = token;
              invitation.data = responseData.data;
              isValid = true;
              // Store invitation in browser, so we can use it after IdP authentication
              localStorage.setItem(
                "issuer-invitation",
                JSON.stringify(invitation)
              );
            } else {
              isValid = false;
            }
            context.commit("setInvitation", invitation);
            resolve(isValid);
          }
        );
      }
    });
  }
};
