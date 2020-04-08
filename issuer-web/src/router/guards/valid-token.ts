import { AppConfig } from "@/models/appConfig";
import { Invitation, InvitationStatus } from "@/models/invitation";
import * as ConfigService from "@/services/config";
import IssuerStore from "@/store";
import { Route } from "vue-router";

export default async function validToken(
  to: Route,
  from: Route,
  next: Function
) {
  const config: AppConfig = await ConfigService.getAppConfig();
  if (!config.inviteRequired) {
    next();
  } else if (to.path === "/") {
    IssuerStore.getInstance()
      .dispatch("invitation/isValidToken", to)
      .then((result: boolean) => {
        if (result) {
          next();
        } else {
          next({ path: "/unauthorized" });
        }
      });
  } else {
    // Check localStorage in case we are coming from the IdP authentication
    const localStorageInvitation =
      localStorage.getItem("issuer-invitation") || "";
    const storeInvitation = IssuerStore.getInstance().getters[
      "invitation/getInvitation"
    ];

    // If there is a precessed invitation in the store use it, otherwise fall-back to localStorage
    const invitation =
      storeInvitation.status !== InvitationStatus.UNDEFINED
        ? storeInvitation
        : localStorageInvitation
        ? (JSON.parse(localStorageInvitation) as Invitation)
        : new Invitation();
    if (invitation.status === InvitationStatus.VALID) {
      next();
    } else {
      next({ path: "unauthorized" });
    }
  }
}
