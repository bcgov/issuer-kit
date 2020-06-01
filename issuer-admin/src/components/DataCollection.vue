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
    <v-card>
      <v-card-title class="headline">Invite</v-card-title>
      <v-card-subtitle class="text-left" v-if="editMode">
        <a :href="inviteLink">{{ inviteLink }}</a>
      </v-card-subtitle>

      <v-form class="pa-4">
        <v-text-field
          v-model="issuerInvite.email"
          :rules="emailRules"
          label="E-mail"
          required
          :disabled="editMode"
        ></v-text-field>
        <v-checkbox
          v-if="editMode"
          v-model="issuerInvite.issued"
          label="Credential has been issued"
        ></v-checkbox>
        <v-checkbox
          v-if="editMode"
          v-model="issuerInvite.expired"
          label="Invite has expired"
        ></v-checkbox>
      </v-form>

      <v-divider></v-divider>

      <v-card-title class="headline">Additional Data</v-card-title>
      <v-card-subtitle class="text-left">
        Properties matching the name of claims in the credential to be issued
        will be used to pre-populate the fields and will prevent users from
        editing the values.
      </v-card-subtitle>

      <survey :survey="survey" :key="surveyKey"></survey>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import { Claim } from "../models/credential";
import { Configuration, AppConfig } from "../models/appConfig";
import { IssuerInvite } from "../models/issuer-invite";

@Component({})
export default class DataCollection extends Vue {
  @Prop({ default: "default" }) private themeName!: string;
  private survey = new SurveyVue.Model();
  private surveyKey = 0;

  private issuerInvite!: IssuerInvite;
  private inviteLink = "";

  private currentUser!: string;

  private emailRules = [
    (v: string) => !!v || "E-mail is required",
    (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid"
  ];

  created() {
    SurveyVue.StylesManager.applyTheme(this.themeName);
    this.registerSurveyFunctions();

    this.$store.dispatch("oidcStore/getOidcUser").then(user => {
      this.currentUser = user.profile.preferred_username;
    });

    this.issuerInvite = new IssuerInvite();
    this.issuerInvite.issued = false;
    this.issuerInvite.expired = false;
  }

  mounted() {
    const config = this.$store.getters[
      "configuration/getConfiguration"
    ] as Configuration;

    const claimConfig = config.claims;
    this.survey = new SurveyVue.Model(claimConfig);

    this.survey.completeText = this.editMode
      ? "Update Invite"
      : "Create Invite";

    this.survey.onComplete.add(result => {
      this.issuerInvite.created_by = this.currentUser; // eslint-disable-line @typescript-eslint/camelcase
      this.issuerInvite.data = result.data;

      let actionPromise;
      if (this.editMode) {
        actionPromise = this.$store.dispatch(
          "issuerInvite/updateInvite",
          this.issuerInvite
        );
      } else {
        actionPromise = this.$store.dispatch(
          "issuerInvite/createInvite",
          this.issuerInvite
        );
      }
      actionPromise.then(result => {
        this.$router.push({ path: "/" });
      });
    });

    if (this.editMode) {
      // load data from stored invite and refresh view
      const id = this.$route.query.id as string;
      this.refreshSurvey(id, config.app.issuer.publicUrl);
    }
  }

  get editMode(): boolean {
    return this.$route.query.id ? true : false;
  }

  private refreshSurvey(inviteId: string, publicUrl: string): void {
    const issuerInvite = this.$store
      .dispatch("issuerInvite/getInvite", inviteId)
      .then((invite: IssuerInvite) => {
        if (invite.data) {
          this.setExistingClaimValues(invite.data);
        }
        this.inviteLink = `${publicUrl}?invite_token=${invite.token}`;
        this.issuerInvite.email = invite.email;
        this.issuerInvite.issued = invite.issued;
        this.issuerInvite.expired = invite.expired;
        this.issuerInvite._id = (this.$route.query.id as string) || "";
        this.surveyKey += 1;
      });
  }

  private setExistingClaimValues(data: any): void {
    Object.keys(data).forEach(key => {
      this.setField(key, data[key]);
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
    surveyFunctions.forEach((f: any) => {
      // eslint-disable-line
      SurveyVue.FunctionFactory.Instance.register(f.name, f);
    });
  }
}
</script>
