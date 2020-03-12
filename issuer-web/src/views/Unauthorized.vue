<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card class="mx-auto my-2 lighten-4" max-width="800" tile>
      <v-card-title class="headline mb-1">Unauthorized</v-card-title>
      <v-card-subtitle
        >You are not authorized to access the resource</v-card-subtitle
      >
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Unauthorized extends Vue {}
</script>
