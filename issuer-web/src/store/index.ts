import config from "@/assets/config/config.json";
import { RootState } from "@/models/storeState";
import { credential } from "@/store/modules/credential/credential";
import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { vuexOidcCreateStoreModule } from "vuex-oidc";

Vue.use(Vuex);

const storeOptions: StoreOptions<RootState> = {
  state: {
    version: "1.0.0" // a simple property
  },
  modules: {
    credential,
    oidcStore: vuexOidcCreateStoreModule(
      config.authentication.oidcSettings,
      // Optional OIDC store settings
      {
        namespaced: true,
        dispatchEventsOnWindow: true
      }
    )
  }
};

export default new Vuex.Store(storeOptions);
