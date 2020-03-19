<style lang="scss">
.v-toolbar__content {
  border-bottom: 2px solid var(--v-secondary-base);
}
</style>

<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Issuer Logo"
        class="shrink mr-2"
        contain
        src="logo.png"
        transition="scale-transition"
        width="40"
      />

      <h1 v-if="config">{{ issuerName }}</h1>
    </div>

    <v-spacer></v-spacer>

    <div v-if="oidcUser">
      Signed in as {{ oidcUser.given_name }} {{ oidcUser.family_name }}
      <v-btn @click="signOutOidc" text>
        <span class="mr-2">Leave</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
import * as ConfigService from "../services/config";
import { AppConfig } from "../models/appConfig";

@Component({
  computed: {
    ...mapGetters("oidcStore", ["oidcUser"]),
    issuerName() {
      return this.config.issuer.name;
    }
  },
  methods: {
    ...mapActions("oidcStore", ["signOutOidc"])
  }
})
export default class Header extends Vue {
  @Prop() logoutUrl!: string;
  private config!: AppConfig;

  async created() {
    this.config = (await ConfigService.getAppConfig()) as AppConfig;
  }
}
</script>
