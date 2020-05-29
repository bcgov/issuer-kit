import { IssuerInviteServiceResponse } from "@/models/api";
import { Configuration } from "@/models/appConfig";
import { IssuerInviteState, RootState } from "@/models/storeState";
import Axios from "axios";
import { DataOptions } from "vuetify";
import { ActionContext, ActionTree } from "vuex";

export const actions: ActionTree<IssuerInviteState, RootState> = {
  async fetchInvites(
    context: ActionContext<IssuerInviteState, RootState>,
    options: DataOptions
  ): Promise<IssuerInviteServiceResponse> {
    const config = context.rootGetters[
      "configuration/getConfiguration"
    ] as Configuration;
    console.log("OPTIONS:", options);
    let skipParam = "";
    let limitParam = "";
    let sortParam = "";
    if (options) {
      skipParam = `%24skip=${(options.page - 1) * options.itemsPerPage}`;
      if (options.itemsPerPage > 0) {
        limitParam = `&%24limit=${options.itemsPerPage}`;
      }
      sortParam = `&%24sort[${options.sortBy[0] || "email"}]=${
        options.sortDesc[0] ? -1 : 1
      }`;
    }
    return new Promise<IssuerInviteServiceResponse>((resolve, reject) => {
      Axios.get(
        `${config.app.apiServer.url}/issuer-invite?${skipParam}${limitParam}${sortParam}`
      )
        .then((response) => {
          const inviteList = response.data as IssuerInviteServiceResponse;
          resolve(inviteList);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  async deleteInvite(
    context: ActionContext<IssuerInviteState, RootState>,
    id: string
  ): Promise<boolean> {
    const config = context.rootGetters[
      "configuration/getConfiguration"
    ] as Configuration;
    return new Promise<boolean>((resolve, reject) => {
      Axios.delete(`${config.app.apiServer.url}/issuer-invite/${id}`)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
};
