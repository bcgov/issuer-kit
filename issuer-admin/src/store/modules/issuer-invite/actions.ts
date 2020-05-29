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
    let skip = 0;
    let limit = 10;
    if (options) {
      skip = (options.page - 1) * options.itemsPerPage;
      limit = options.itemsPerPage > 0 ? options.itemsPerPage : limit;
    }
    return new Promise<IssuerInviteServiceResponse>((resolve, reject) => {
      Axios.get(
        `${config.app.apiServer.url}/issuer-invite?%24skip=${skip}&%24limit=${limit}`
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
