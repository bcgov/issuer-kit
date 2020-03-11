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
      },
      // Optional OIDC event listeners
      {
        userLoaded: (user: any) => console.log("OIDC user is loaded:", user), // eslint-disable-line
        userUnloaded: () => console.log("OIDC user is unloaded"),
        accessTokenExpiring: () => console.log("Access token will expire"),
        accessTokenExpired: () => console.log("Access token did expire"),
        silentRenewError: () => console.log("OIDC user is unloaded"),
        userSignedOut: () => console.log("OIDC user is signed out"),
        oidcError: (payload: any) => console.log("OIDC error", payload) // eslint-disable-line
      }
    )
  }
};

export default new Vuex.Store(storeOptions);
