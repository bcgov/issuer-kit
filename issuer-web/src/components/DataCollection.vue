<!-- Styles are NOT scoped to the component in order to override surveyJS defaults -->
<style>
.claim-data-container {
  display: inline-block;
  width: 100%;
  text-align: justify;
}

.sv_body {
  border: none !important;
}

.sv_main .sv_container .sv_body .sv_nav .sv_complete_btn {
  background-color: var(--v-success-base);
}
</style>

<template>
  <v-container class="claim-data-container">
    <survey :survey="survey"></survey>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import claimConfig from "@/assets/config/claim-config.json";
import { Credential, Claim } from "../models/credential";

@Component
export default class Header extends Vue {
  @Prop({ default: "default" }) private themeName!: string;
  private survey!: SurveyVue.Model;

  created() {
    SurveyVue.StylesManager.applyTheme(this.themeName);

    this.survey = new SurveyVue.Model(claimConfig);
    this.survey.completeText = "Request Credential";
  }

  mounted() {
    this.survey.onComplete.add(result => {
      const credentialClaims = new Array<Claim>();
      Object.keys(result.data).forEach(key => {
        credentialClaims.push({ name: key, value: result.data[key] });
      });
      this.$store.commit("credential/updateClaims", credentialClaims);

      // Go to next page on successful completion
      this.$router.push("confirm-data");
    });

    const credential = this.$store.getters[
      "credential/getCredential"
    ] as Credential;
    if (credential !== undefined && credential.claims.length > 0) {
      // we are navigating back from the confirmation page, re-populate fields
      // TODO: disable fields that come from OIDC
      this.setExistingClaimValues(credential.claims);
    }
    // use values provided by OIDC token, if available
    // by doing this, any claim coming from OIDC will be disabled as well
    // TODO: hook up with data coming from IdP/token
    this.valuesFromToken({
      given_names: "Emiliano", // eslint-disable-line
      family_name: "Sune", // eslint-disable-line
      birthdate: "2020-03-05" // eslint-disable-line
    });
  }

  // eslint-disable-next-line
  private valuesFromToken(values: { [key: string]: any }) {
    Object.entries(values).forEach(([key, value]) => {
      this.setField(key, value, true);
    });
  }

  private setExistingClaimValues(claims: Claim[]) {
    claims.forEach(claim => {
      this.setField(claim.name, claim.value);
    });
  }

  private setField(key: string, value: string, readonly = false) {
    try {
      this.survey.getQuestionByName(key).setPropertyValue("value", value);
      this.survey.setValue(key, value);
      this.survey.getQuestionByName(key).readOnly = readonly;
    } catch (e) {
      // eslint-disable-next-line
      console.warn(
        `The provided key '${key}' is not a valid field and was skipped.`
      );
    }
  }
}
</script>
