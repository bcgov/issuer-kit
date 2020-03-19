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
        <v-row v-if="!issued">
          <v-col cols="12">
            <v-progress-circular
              :indeterminate="true"
              rotate="true"
              size="24"
              width="4"
              color="secondary darken-2"
              class="mx-3"
            ></v-progress-circular>
            Credential Offer sent. Waiting for you to accept it...
          </v-col>
        </v-row>
        <v-row v-if="issued">
          <v-col cols="12">
            <v-icon class="mx-3" color="success">fas fa-handshake</v-icon>
            You accepted the Credential Offer.
          </v-col>
        </v-row>
        <v-row v-if="issued">
          <v-col cols="12">
            <v-icon class="mx-3" color="success">fas fa-check-circle</v-icon>
            Your Credential has been Issued!
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="mx-4" v-if="issued"></v-divider>

      <v-container fluid v-if="issued">
        <p>
          Congratulations, your credential has been issued!
          <br />
          You will receive a notification to store the credential in your
          wallet.
        </p>
        <p>
          To try out your new credential please
          <a :href="config.testLink">click here</a>.
        </p>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";
import { Connection } from "../models/connection";
import { Credential } from "../models/credential";
import * as ConfigService from "../services/config";
import { AppConfig } from "../models/appConfig";

@Component
export default class Connect extends Vue {
  private config!: AppConfig;
  private issued = false;
  private pollingAttempts: any[] = [];
  private credExId!: string;

  async created() {
    this.config = (await ConfigService.getAppConfig()) as AppConfig;
  }

  mounted() {
    this.requestCredentialIssuance().then(result => {
      this.credExId = result.data.credential_exchange_id;
      this.handleIssueCredential(this).then(() => {
        this.issued = true;
        this.clearPolling();
      });
    });
  }

  beforeDestroy() {
    this.clearPolling();
  }

  async handleIssueCredential(context: any) {
    // save context for accessing in recursive function
    const credExId = context.credExId;
    const retries = context.pollingAttempts;

    async function checkCredExStatus(resolve: Function) {
      const response = await Axios.get(
        `${this.config.apiServer.url}/issues/${credExId}`
      );

      // if there is no object matching teh CredExId, try again
      if (!response || !response.data.issued) {
        const id = setTimeout(() => checkCredExStatus(resolve), 2000);
        retries.push(id);
      } else {
        resolve(response);
      }
    }
    return new Promise(resolve => checkCredExStatus(resolve));
  }

  private async requestCredentialIssuance(): Promise<any> {
    const credential = (await this.$store.getters[
      "credential/getCredential"
    ]) as Credential;
    const connection = (await this.$store.getters[
      "connection/getConnection"
    ]) as Connection;
    let invitation;
    try {
      const localInvitation = localStorage.getItem("issuer-invitation") || "{}";
      invitation = JSON.parse(localInvitation);
    } catch (e) {
      console.error(
        "An error occurred when fetching the invite object from localstorage"
      );
      console.error(e);
    }
    const data = {
      _id: invitation.data._id,
      connectionId: connection.id,
      claims: credential.claims
    };
    return Axios.post(`${this.config.apiServer.url}/issues/`, data);
  }

  private clearPolling() {
    this.pollingAttempts.forEach(item => {
      clearTimeout(item);
    });
  }
}
</script>
