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

.sv_nav .sv_complete_btn {
  display: none;
}
</style>

<template>
  <v-container class="claim-data-container">
    <v-card>
      <v-card-title class="headline">Invite</v-card-title>
      <v-card-subtitle class="text-left" v-if="editMode">
        <a :href="inviteLink">{{ inviteLink }}</a>
      </v-card-subtitle>

      <v-form class="pa-4" ref="form">
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
          v-if="editMode && issuerInvite.revoked != null"
          v-model="issuerInvite.revoked"
          label="Credential was revoked"
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

      <v-divider></v-divider>

      <v-container fluid>
        <v-row class="mx-4" justify="end">
          <v-col cols="12" md="2">
            <v-btn outlined color="success" @click="validateAndSave"
              >Save</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import { Configuration } from "../models/appConfig";
import { IssuerInvite } from "../models/issuer-invite";

interface DataCollectionType extends Vue {
  validate(): boolean;
}

@Component({})
export default class DataCollection extends Vue {
  @Prop({ default: "default" }) private themeName!: string;
  private survey = new SurveyVue.Model();
  private surveyKey = 0;

  private issuerInvite!: IssuerInvite;
  private inviteLink = "";

  $refs!: {
    form: DataCollectionType;
  };
  private emailRules = [
    (email: string) => !!email || "E-mail is required",
    (email: string) =>
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      ) || "E-mail must be valid"
  ];

  created() {
    SurveyVue.StylesManager.applyTheme(this.themeName);
    this.registerSurveyFunctions();

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

    if (this.editMode) {
      // load data from stored invite and refresh view
      const id = this.$route.query.id as string;
      this.refreshSurvey(id, config.app.issuer.publicUrl);
    }
  }

  get editMode(): boolean {
    return this.$route.query.id ? true : false;
  }

  private validateAndSave(): void {
    if (!this.$refs.form.validate() || !this.survey.completeLastPage()) {
      return;
    } else {
      this.issuerInvite.data = this.survey.data;

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
    }
  }

  private refreshSurvey(inviteId: string, publicUrl: string): void {
    const issuerInvite = this.$store
      .dispatch("issuerInvite/getInvite", inviteId)
      .then((invite: IssuerInvite) => {
        if (invite.data) {
          this.setExistingClaimValues(invite.data);
        }
        this.inviteLink = `${publicUrl}/?invite_token=${invite.token}`;
        this.issuerInvite.email = invite.email;
        this.issuerInvite.issued = invite.issued;
        this.issuerInvite.expired = invite.expired;
        this.issuerInvite.revoked = invite.revoked;
        this.issuerInvite.revocation_id = invite.revocation_id; // eslint-disable-line @typescript-eslint/camelcase
        this.issuerInvite.revoc_reg_id = invite.revoc_reg_id; // eslint-disable-line @typescript-eslint/camelcase
        this.issuerInvite.revocation_history = invite.revocation_history; // eslint-disable-line @typescript-eslint/camelcase
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
