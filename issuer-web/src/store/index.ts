import { RootState } from "@/models/storeState";
import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { credential } from "./modules/credential/credential";

Vue.use(Vuex);

const storeOptions: StoreOptions<RootState> = {
  state: {
    version: "1.0.0" // a simple property
  },
  modules: {
    credential
  }
};

export default new Vuex.Store(storeOptions);
