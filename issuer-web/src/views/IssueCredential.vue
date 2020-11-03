<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card class="mx-auto my-2 lighten-4" max-width="800" tile>
      <v-card-title class="headline mb-1">Issuing Credential</v-card-title>

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
          {{ successText }}
        </p>
        <ul>
          <li v-for="link in successLinks" :key="link.url">
            <a :href="link.url">{{ link.description }}</a>
          </li>
        </ul>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Axios, { CancelTokenSource } from "axios";
import { Connection } from "../models/connection";
import { Credential } from "../models/credential";
import { AppConfig, Configuration } from "../models/appConfig";
import { sleep } from "../utils";
import { Invitation } from "../models/invitation";

@Component
export default class Connect extends Vue {
  private issued = false;
  private successText = "";
  private successLinks = new Array<any>();
  private cancelTokenSource!: CancelTokenSource;
  private idToken!: string;

  created() {
    this.cancelTokenSource = Axios.CancelToken.source();
    this.idToken = this.$store.getters["oidcStore/oidcIdToken"];
  }

  mounted() {
    const appConfig = this.$store.getters[
      "configuration/getConfiguration"
    ] as Configuration;
    this.successText = appConfig.app.issuedSuccess.successText;
    this.successLinks = appConfig.app.issuedSuccess.links;
    this.requestCredentialIssuance(appConfig.app).then(result => {
      this.handleIssueCredential(
        result.data.credential_exchange_id,
        appConfig.app
      ).then(() => {
        this.issued = true;
        // silently sign out of the app
        this.$store.dispatch("oidcStore/signOutOidcSilent");

        // remove data from localStorage
        localStorage.removeItem("issuer-invitation");
      });
    });
  }

  beforeDestroy() {
    // cancelling pending requests, if any
    this.cancelTokenSource.cancel();
  }

  async handleIssueCredential(credExId: string, config: AppConfig) {
    const retryInterceptor = Axios.interceptors.response.use(
      async response => {
        if (response.data.state === "credential_issued") {
          return response;
        } else {
          // retry every 500ms until the credential has not been issued
          await sleep(500);
          return Axios.request(response.config);
        }
      },
      error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      }
    );

    return await Axios.get(
      `${config.apiServer.url}/credential-exchange/${credExId}`,
      {
        cancelToken: this.cancelTokenSource.token,
        headers: {
          authorization: `Bearer ${this.idToken}`
        }
      }
    ).finally(() => {
      Axios.interceptors.response.eject(retryInterceptor);
    });
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async requestCredentialIssuance(config: AppConfig): Promise<any> {
    const credential = (await this.$store.getters[
      "credential/getCredential"
    ]) as Credential;
    const connection = (await this.$store.getters[
      "connection/getConnection"
    ]) as Connection;
    const invitation = this.$store.getters[
      "invitation/getInvitation"
    ] as Invitation;
    const data = {
      token: invitation.token,
      connection_id: connection.id, // eslint-disable-line @typescript-eslint/camelcase
      claims: credential.claims,
      schema_id: config.credentials?.schema_id // eslint-disable-line @typescript-eslint/camelcase
    };
    return Axios.post(`${config.apiServer.url}/credential-exchange/`, data, {
      cancelToken: this.cancelTokenSource.token,
      headers: {
        authorization: `Bearer ${this.idToken}`
      }
    });
  }
}
</script>
