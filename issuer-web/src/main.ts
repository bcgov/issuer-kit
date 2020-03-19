import App from "@/App.vue";
import Vuetify from "@/plugins/vuetify";
import router from "@/router";
import * as ConfigService from "@/services/config";
import IssueStore from "@/store";
import "@/styles.scss";
import "@babel/polyfill";
import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import Vue from "vue";
import { UserVuetifyPreset } from "vuetify";
import { AppConfig } from "./models/appConfig";

Vue.config.productionTip = false;

Promise.all([
  ConfigService.getAppConfig(),
  ConfigService.getThemeConfig()
]).then(values => {
  const config = values[0] as AppConfig;
  const themeConfig = values[1] as UserVuetifyPreset;

  new Vue({
    store: IssueStore.getInstance(config),
    router: router(config),
    vuetify: new Vuetify(themeConfig),
    render: h => h(App)
  }).$mount("#app");
});
