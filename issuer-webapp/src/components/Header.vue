<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Issuer Logo"
        class="shrink mr-2"
        contain
        src="../assets/logo.png"
        transition="scale-transition"
        width="40"
      />

      <h1>{{ config.issuer.name }}</h1>
    </div>

    <v-spacer></v-spacer>

    <v-btn href="https://www.canada.ca" target="_blank" text>
      <span class="mr-2">Leave</span>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import config from "@/assets/config/config.json";

@Component
export default class Header extends Vue {
  @Prop() logoutUrl!: string;

  readonly config = config;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
