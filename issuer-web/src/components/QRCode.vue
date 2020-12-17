<style scoped lang="scss"></style>

<template>
  <vue-qrcode
    :value="value"
    :width="width"
    :margin="margin"
    :errorCorrectionLevel="errorCorrectionLevel"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import VueQrcode from "vue-qrcode";

@Component({ components: { VueQrcode } })
export default class QRCode extends Vue {
  @Prop({ default: "" }) value!: string;
  @Prop({ default: 200 }) width!: number;
  @Prop({ default: 0 }) margin!: number;
  @Prop({ default: "L" }) errorCorrectionLevel!: string;
}
</script>
