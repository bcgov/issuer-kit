import { Configuration } from "@/models/appConfig";
import { ConfigurationState, RootState } from "@/models/storeState";
import { GetterTree } from "vuex";

export const getters: GetterTree<ConfigurationState, RootState> = {
  getConfiguration(state: ConfigurationState): Configuration {
    const { configuration } = state;
    return configuration;
  }
};
