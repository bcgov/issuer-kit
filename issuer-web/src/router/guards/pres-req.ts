import IssuerStore from "@/store";
import { Route } from "vue-router";
import { decode } from "jsonwebtoken";
import * as ConfigService from "@/services/config";
import { AppConfig } from "@/models/appConfig";

export default async function hasPresReq(
  to: Route,
  from: Route,
  next: Function
) {
  const config: AppConfig = await ConfigService.getAppConfig();
  IssuerStore.getInstance()
    .dispatch("oidcStore/getOidcUser")
    .then(result => {
      //grab req id tokens if they exist
      const idToken = decode(result?.id_token) as { [key: string]: any }; // eslint-disable-line
      const reqId = idToken?.pres_req_conf_id;
      const confReqId =
        config.authentication.oidcSettings?.extraQueryParams?.pres_req_conf_id;

      //unauthorized if pre_req_conf_id are both set and mismatch
      if (confReqId && reqId !== confReqId) {
        next({ path: "unauthorized" });
      } else {
        next();
      }
    });
}
