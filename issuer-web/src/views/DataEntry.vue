<style scoped></style>

<template>
  <DataCollection />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DataCollection from "@/components/DataCollection.vue";
import { Configuration } from "../models/appConfig";

@Component({ components: { DataCollection } })
export default class DataEntry extends Vue {
  mounted() {
    const appConfig = this.$store.getters[
      "configuration/getConfiguration"
    ] as Configuration;

    if (
      appConfig.app.help?.enabled &&
      appConfig.app.help?.displayOnFirstVisit &&
      !this.$cookies.get("help-viewed")
    ) {
      // display help dialog if configured and not viewed
      this.$emit("helpDialog", true);
      this.$cookies.set("help-viewed", true);
    }
  }
}
</script>
