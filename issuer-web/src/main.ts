import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import store from "@/store";
import "@/styles.scss";
import "@babel/polyfill";
import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import Vue from "vue";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
