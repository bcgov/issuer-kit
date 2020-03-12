<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card class="mx-auto my-2 lighten-4" max-width="800" tile>
      <v-container>
        <v-icon x-large color="error darken-2"
          >fas fa-exclamation-triangle</v-icon
        >
        <p class="my-3">You are not authorized to access the resource</p>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Unauthorized extends Vue {}
</script>
