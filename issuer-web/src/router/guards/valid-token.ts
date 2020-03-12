import { Invitation, InvitationStatus } from "@/models/invitation";
import store from "@/store";
import { Route } from "vue-router";

export default function validToken(to: Route, from: Route, next: Function) {
  if (to.path === "/") {
    store.dispatch("invitation/isValidToken", to).then((result: boolean) => {
      if (result) {
        next();
      } else {
        next({ path: "/unauthorized" });
      }
    });
  } else {
    const storedInvitation = localStorage.getItem("issuer-invitation") || "";
    const invitation = storedInvitation
      ? (JSON.parse(storedInvitation) as Invitation)
      : new Invitation();
    if (invitation.status === InvitationStatus.VALID) {
      next();
    } else {
      next({ path: "unauthorized" });
    }
  }
}
