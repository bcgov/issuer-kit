import { ConfigurationState, RootState } from "@/models/storeState";
import { ActionTree, ActionContext } from "vuex";
import { Configuration, AppConfig } from "@/models/appConfig";
import * as ConfigService from "@/services/config";

export const actions: ActionTree<ConfigurationState, RootState> = {
  async getConfiguration(
    context: ActionContext<ConfigurationState, RootState>
  ): Promise<Configuration> {
    return new Promise<Configuration>((resolve, reject) => {
      const config = context.rootGetters[
        "configuration/getConfiguration"
      ] as Configuration;
      if (config && config.app && config.claims) {
        return resolve(config);
      } else {
        Promise.all([
          ConfigService.getAppConfig(),
          ConfigService.getClaimConfig()
        ])
          .then(values => {
            const config = values[0] as AppConfig;
            const claimConfig = values[1];
            context.commit("setAppConfig", config);
            context.commit("setClaimConfig", claimConfig);
            return resolve(context.getters("getConfiguration"));
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }
};
