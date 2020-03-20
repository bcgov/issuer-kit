<style scoped></style>

<template>
  <DataCollection />
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import DataCollection from "@/components/DataCollection.vue";

@Component({ components: { DataCollection } })
export default class DataEntry extends Vue {}
</script>
