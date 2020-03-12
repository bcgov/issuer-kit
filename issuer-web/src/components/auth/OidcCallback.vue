<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card class="mx-auto my-2 lighten-4" max-width="800" tile>
      <!-- <v-container class="progress-indicator">
        <v-progress-linear
          indeterminate
          color="secondary darken-2"
        ></v-progress-linear>
      </v-container> -->

      <v-container>
        <v-row>
          <v-col cols="12">
            <v-progress-circular
              :indeterminate="true"
              rotate="true"
              size="24"
              width="4"
              color="secondary darken-2"
              class="mx-3"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapActions } from "vuex";

@Component({
  methods: {
    ...mapActions("oidcStore", ["oidcSignInCallback"])
  }
})
export default class OidcCallback extends Vue {
  mounted() {
    this.$store
      .dispatch("oidcStore/oidcSignInCallback")
      .then(redirectPath => {
        this.$router.push(redirectPath);
      })
      .catch(err => {
        console.error(err);
        this.$router.push({ path: "/oidc-callback-error" }); // Handle errors any way you want
      });
  }
}
</script>
