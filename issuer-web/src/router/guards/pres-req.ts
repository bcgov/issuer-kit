import IssuerStore from "@/store";
import { Route } from "vue-router";
import jwt_decode from "jwt-decode";
import * as ConfigService from "@/services/config";
import { AppConfig } from "@/models/appConfig";

export default async function hasPresReq(
  to: Route,
  from: Route,
  next: Function
) {
  const config: AppConfig = await ConfigService.getAppConfig();
  if (config.authentication.enabled) {
    IssuerStore.getInstance()
      .dispatch("oidcStore/getOidcUser")
      .then((result) => {
        //grab req id tokens if they exist
        const idToken = jwt_decode(result?.id_token) as { [key: string]: any }; // eslint-disable-line
        const reqId = idToken?.pres_req_conf_id;
        const confReqId =
          config.authentication.oidcSettings?.extraQueryParams
            ?.pres_req_conf_id;

        //unauthorized if pre_req_conf_id are both set and mismatch
        if (confReqId && reqId !== confReqId) {
          next({ path: "unauthorized" });
        } else {
          next();
        }
      });
  } else {
    next();
  }
}
