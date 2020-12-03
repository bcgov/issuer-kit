import IssuerStore from "@/store";
import { Route } from "vue-router";
import { decode, verify } from "jsonwebtoken";
import { AppConfig } from '@/models/appConfig';
import * as ConfigService from "@/services/config";



export default async function hasPresReq(
  to: Route,
  from: Route,
  next: Function
) {
  const config: any = await ConfigService.getAppConfig();
  IssuerStore.getInstance()
    .dispatch("oidcStore/getOidcUser")
    .then((result: any) => {
        //grab req id tokens if they exist
        const idToken = decode(result?.id_token) as any
        const reqId = idToken?.pres_req_conf_id
        const confReqId = config.authentication.oidcSettings?.extraQueryParams?.pres_req_conf_id

        //unauthorized if pre_req_conf_id are both set and mismatch
        if(reqId && confReqId && (reqId !== confReqId)){
          next({ path: "unauthorized" });
        }else{
          next();
        }
        
    });
}
