<template>
  <v-footer padless>
    <v-col class="text-center" cols="12">
      {{ new Date().getFullYear() }} — <strong>{{ config.issuer.name }}</strong>
    </v-col>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AppConfig } from "../models/appConfig";
import * as ConfigService from "../services/config";

@Component
export default class Footer extends Vue {
  private config!: AppConfig;

  async created() {
    this.config = (await ConfigService.getAppConfig()) as AppConfig;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
