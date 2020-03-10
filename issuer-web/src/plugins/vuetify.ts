import themeConfig from "@/assets/config/vuetify.json";
import "@fortawesome/fontawesome-free/css/all.css";
import Vue from "vue";
import Vuetify, { UserVuetifyPreset } from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify(themeConfig as UserVuetifyPreset);
