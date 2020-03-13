<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card class="mx-auto my-2 lighten-4" max-width="800" tile>
      <v-container>
        <CustomHtmlComponent :html="htmlContent" />
      </v-container>

      <v-divider class="mx-4"></v-divider>

      <v-container fluid>
        <v-row class="mx-4">
          <v-col cols="12">
            <v-checkbox
              v-model="confirmed"
              label="I agree with the above terms and conditions."
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row class="mx-4" justify="end">
          <v-col cols="12" md="2">
            <v-btn
              outlined
              color="success"
              :disabled="!confirmed"
              :to="{ path: 'credential-data' }"
              >Agree</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CustomHtmlComponent from "@/components/CustomHtmlComponent.vue";
import Axios from "axios";

@Component({ components: { CustomHtmlComponent } })
export default class Home extends Vue {
  private confirmed = false;
  private htmlContent = "";

  beforeCreate() {
    Axios.get("/terms-and-conditions.html").then(htmlContent => {
      this.htmlContent = htmlContent.data;
    });
  }
}
</script>
