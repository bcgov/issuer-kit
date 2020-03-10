<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card class="mx-auto my-2 lighten-4" max-width="800" tile>
      <v-card-title class="headline mb-1">Issuing Credential</v-card-title>

      <!-- <v-container class="progress-indicator">
        <v-progress-linear
          indeterminate
          color="secondary darken-2"
        ></v-progress-linear>
      </v-container> -->

      <v-container class="progress-steps">
        <v-row>
          <v-col cols="12">
            <v-icon class="mx-3" color="success">fas fa-wifi</v-icon>
            Connected to the Issuer Agent
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-progress-circular
              indeterminate="true"
              rotate="true"
              size="24"
              width="4"
              color="secondary darken-2"
              class="mx-3"
            ></v-progress-circular>

            Credential Offer sent. Waiting for you to accept it...
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-icon class="mx-3" color="success">fas fa-check-circle</v-icon>
            Your Credential has been Issued!
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="mx-4"></v-divider>

      <v-container fluid>
        <p>
          Congratulations, your credential has been issued!
          <br />
          You will receive a notification to store the credential in your
          wallet.
        </p>
        <p>
          To try out your new credential please
          <a :href="link">click here</a>.
        </p>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Connect extends Vue {
  private link!: string;

  created() {
    // TODO: use link form settings
    this.link = "https://www.google.ca";
  }
}
</script>
