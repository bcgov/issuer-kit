import { IssuerInviteListServiceResponse } from "@/models/api";
import { Configuration } from "@/models/appConfig";
import { IssuerInviteState, RootState } from "@/models/storeState";
import Axios from "axios";
import { DataOptions } from "vuetify";
import { ActionContext, ActionTree } from "vuex";
import { IssuerInvite } from "@/models/issuer-invite";

export const actions: ActionTree<IssuerInviteState, RootState> = {
  async fetchInvites(
    context: ActionContext<IssuerInviteState, RootState>,
    options: {
      dataOptions: DataOptions;
      searchString?: string;
    }
  ): Promise<IssuerInviteListServiceResponse> {
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
    return new Promise<IssuerInviteListServiceResponse>((resolve, reject) => {
      Axios.get(
        `${config.app.apiServer.url}/issuer-invite?${skipParam}${limitParam}${sortParam}${searchParam}`
      )
        .then(response => {
          const inviteList = response.data as IssuerInviteListServiceResponse;
          resolve(inviteList);
        })
        .catch(error => {
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
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  },
  async createInvite(
    context: ActionContext<IssuerInviteState, RootState>,
    issuerInvite: IssuerInvite
  ): Promise<boolean> {
    const config = context.rootGetters[
      "configuration/getConfiguration"
    ] as Configuration;
    return new Promise<boolean>((resolve, reject) => {
      Axios.post(`${config.app.apiServer.url}/issuer-invite`, issuerInvite)
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  },
  async getInvite(
    context: ActionContext<IssuerInviteState, RootState>,
    id: string
  ): Promise<IssuerInvite> {
    const config = context.rootGetters[
      "configuration/getConfiguration"
    ] as Configuration;
    return new Promise<IssuerInvite>((resolve, reject) => {
      Axios.get(`${config.app.apiServer.url}/issuer-invite/${id}`)
        .then(response => {
          const invite = response.data as IssuerInvite;
          resolve(invite);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  },
  async updateInvite(
    context: ActionContext<IssuerInviteState, RootState>,
    issuerInvite: IssuerInvite
  ): Promise<boolean> {
    const config = context.rootGetters[
      "configuration/getConfiguration"
    ] as Configuration;
    const sanitizedInvite = {
      email: issuerInvite.email,
      data: issuerInvite.data,
      issued: issuerInvite.issued,
      expired: issuerInvite.expired,
      updated_by: issuerInvite.updated_by // eslint-disable-line @typescript-eslint/camelcase
    };

    return new Promise<boolean>((resolve, reject) => {
      Axios.patch(
        `${config.app.apiServer.url}/issuer-invite/${issuerInvite._id}`,
        sanitizedInvite
      )
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }
};
