<style scoped lang="scss"></style>

<template>
  <vue-qrcode :value="value" :width="width" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import VueQrcode from "vue-qrcode";

@Component({ components: { VueQrcode } })
export default class QRCode extends Vue {
  @Prop({ default: "" }) value!: string;
  @Prop({ default: 200 }) width!: number;
}
</script>
