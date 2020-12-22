<!-- Styles are NOT scoped to the component in order to override surveyJS defaults -->
<style lang="scss">
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
    <survey :survey="survey" :key="surveyKey"></survey>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import { Credential, Claim } from "../models/credential";
import { mapGetters } from "vuex";
import { Invitation } from "../models/invitation";

@Component({
  computed: {
    ...mapGetters("oidcStore", ["oidcUser"])
  }
})
export default class DataCollection extends Vue {
  @Prop({ default: "default" }) private themeName!: string;
  private survey = new SurveyVue.Model();
  private surveyKey = 0;

  created() {
    SurveyVue.StylesManager.applyTheme(this.themeName);
    this.registerSurveyFunctions();
  }

  mounted() {
    const claimConfig = this.$store.getters["configuration/getConfiguration"]
      .claims;
    this.survey = new SurveyVue.Model(claimConfig);
    this.survey.completeText = "Request Credential";
    this.survey.onComplete.add(result => {
      const credentialClaims = new Array<Claim>();
      Object.keys(result.data).forEach(key => {
        credentialClaims.push({ name: key, value: result.data[key] });
      });
      this.$store.commit("credential/updateClaims", credentialClaims);

      // Go to next page on successful completion
      this.$router.push({ path: "confirm-data" });
    });

    this.refreshSurvey();
  }

  private refreshSurvey(): void {
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
    this.valuesFromToken(this.$store.getters["oidcStore/oidcUser"]);

    // if the user received an invite, use the values provided, if any
    this.valuesFromInvitation();

    this.surveyKey += 1;
  }

  // eslint-disable-next-line
  private valuesFromToken(values: { [key: string]: any }): void {
    if (values) {
      Object.entries(values).forEach(([key, value]) => {
        this.setField(key, value, true);
      });
    }
  }

  private valuesFromInvitation(): void {
    const invitation = this.$store.getters[
      "invitation/getInvitation"
    ] as Invitation;
    if (invitation.data) {
      Object.entries(invitation.data).forEach(([key, value]) => {
        this.setField(key, value as string, true);
      });
    }
  }

  private setExistingClaimValues(claims: Claim[]): void {
    claims.forEach(claim => {
      this.setField(claim.name, claim.value);
    });
  }

  private setField(key: string, value: string, readonly = false): void {
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

  private registerSurveyFunctions(): void {
    // eslint-disable-next-line
    // @ts-ignore: implicit any type
    const surveyFunctions = window["surveyFunctions"] || [];
    surveyFunctions.forEach((f: any) => { // eslint-disable-line
      // eslint-disable-line
      SurveyVue.FunctionFactory.Instance.register(f.name, f);
    });
  }
}
</script>
