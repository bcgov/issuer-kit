<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card class="mx-auto my-2 lighten-4" max-width="800" tile>
      <v-card-title class="headline mb-1">Connect with Issuer</v-card-title>

      <p>
        Scan the QR code using a Trusted Digital Wallet to establish a
        connection with the Issuer.
      </p>

      <p>
        Once a connection is established, the credential issuance process will
        start automatically.
      </p>

      <QRCode :value="textInvitation" :width="width" />

      <v-container>
        <v-btn color="white" :h="`didcomm://launch?d_m=${base64Invitation}`">
          <v-icon left light>fas fa-external-link-alt</v-icon>
          Open in a Trusted Digital Wallet
        </v-btn>
      </v-container>

      <v-divider class="mx-4"></v-divider>

      <v-container fluid>
        <v-row align="center" justify="space-between" class="mr-2">
          <v-col cols="6" md="2">
            <v-btn outlined color="error" @click="$router.push('confirm-data')"
              >Back</v-btn
            >
          </v-col>
          <v-col cols="6" md="2"> </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import QRCode from "@/components/QRCode.vue";

@Component({ components: { QRCode } })
export default class Connect extends Vue {
  private textInvitation!: string;
  private base64Invitation!: string;
  private width!: number;

  created() {
    // TODO: replace with invitation link
    this.textInvitation = "https://www.google.ca";
    this.base64Invitation = btoa(this.textInvitation);
    this.width = 200;
  }
}
</script>
