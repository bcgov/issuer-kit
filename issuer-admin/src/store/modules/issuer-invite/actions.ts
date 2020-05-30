import { IssuerInviteServiceResponse } from "@/models/api";
import { Configuration } from "@/models/appConfig";
import { IssuerInviteState, RootState } from "@/models/storeState";
import Axios from "axios";
import { DataOptions } from "vuetify";
import { ActionContext, ActionTree } from "vuex";

export const actions: ActionTree<IssuerInviteState, RootState> = {
  async fetchInvites(
    context: ActionContext<IssuerInviteState, RootState>,
    options: {
      dataOptions: DataOptions;
      searchString?: string;
    }
  ): Promise<IssuerInviteServiceResponse> {
    const config = context.rootGetters[
      "configuration/getConfiguration"
    ] as Configuration;
    let skipParam = "";
    let limitParam = "";
    let sortParam = "";
    let searchParam = "";
    if (options.dataOptions) {
      skipParam = `%24skip=${(options.dataOptions.page - 1) *
        options.dataOptions.itemsPerPage}`;
      if (options.dataOptions.itemsPerPage > 0) {
        limitParam = `&%24limit=${options.dataOptions.itemsPerPage}`;
      }
      sortParam = `&%24sort[${options.dataOptions.sortBy[0] || "email"}]=${
        options.dataOptions.sortDesc[0] ? -1 : 1
      }`;
    }
    if (options.searchString) {
      searchParam = `&email=${options.searchString}`;
    }
    return new Promise<IssuerInviteServiceResponse>((resolve, reject) => {
      Axios.get(
        `${config.app.apiServer.url}/issuer-invite?${skipParam}${limitParam}${sortParam}${searchParam}`
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
