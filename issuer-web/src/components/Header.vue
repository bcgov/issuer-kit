<style lang="scss">
.v-toolbar__content {
  border-bottom: 2px solid var(--v-secondary-base);
}

.issuer-logo {
  height: 50px;
  width: 50px;
}

.userinfo {
  margin-left: 20px;
}
</style>

<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Issuer Logo"
        class="shrink mr-2 issuer-logo"
        contain
        src="logo.svg"
        transition="scale-transition"
      />

      <h1>{{ issuerName }}</h1>
    </div>

    <v-spacer></v-spacer>

    <v-dialog v-model="helpDialog" v-if="helpDialogEnabled">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon small>
          <v-icon>far fa-question-circle</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-container>
          <CustomHtmlComponent :html="helpContent" />
        </v-container>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary darken-1" @click="closeHelp()">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="oidcUser" class="userinfo">
      Signed in as {{ oidcUser.given_name }} {{ oidcUser.family_name }}
      <v-btn @click="signOutOidc" text>
        <span class="mr-2">Leave</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";
import { Configuration } from "../models/appConfig";
import CustomHtmlComponent from "@/components/CustomHtmlComponent.vue";
import Axios from "axios";

@Component({
  computed: {
    ...mapGetters("oidcStore", ["oidcUser"])
  },
  methods: {
    ...mapActions("oidcStore", ["signOutOidc"])
  },
  components: { CustomHtmlComponent }
})
export default class Header extends Vue {
  @Prop() logoutUrl!: string;

  private issuerName = "";

  @Prop() helpDialog!: boolean;
  private helpDialogOpened = false;
  private helpDialogEnabled = false;
  private helpContent = "";

  beforeCreate() {
    const appConfig = this.$store.getters[
      "configuration/getConfiguration"
    ] as Configuration;

    if (appConfig.app.help?.enabled) {
      Axios.get("/help.html").then(htmlContent => {
        this.helpContent = htmlContent.data;
      });
    }
  }

  created() {
    const appConfig = this.$store.getters[
      "configuration/getConfiguration"
    ] as Configuration;
    this.issuerName = appConfig.app.issuer.name;

    if (appConfig.app.help?.enabled) {
      this.helpDialogEnabled = true;
    }
  }

  closeHelp() {
    this.helpDialog = false;
    this.$emit("helpDialog", false);
  }
}
</script>
