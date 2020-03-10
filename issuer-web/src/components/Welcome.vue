<style scoped lang="scss"></style>

<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Welcome extends Vue {
  @Prop() private msg!: string;
}
</script>
