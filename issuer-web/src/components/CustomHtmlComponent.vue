<style scoped lang="scss"></style>

<template>
  <div v-html="html"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CustomHtmlComponent extends Vue {
  @Prop() private html!: string;
}
</script>
