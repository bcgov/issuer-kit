import IssuerStore from "@/store";
import { Route } from "vue-router";

export default async function hasAdminRole(
  to: Route,
  from: Route,
  next: Function
) {
  IssuerStore.getInstance()
    .dispatch("oidcStore/getOidcUser")
    .then((result: any) => {
      const roles = result.profile.roles as string[];
      if (roles && roles.indexOf("admin") > -1) {
        next();
      } else {
        next({ path: "unauthorized" });
      }
    });
}
