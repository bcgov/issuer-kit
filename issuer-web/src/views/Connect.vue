<style scoped lang="scss"></style>

<template>
  <vue-qrcode :value="connectionInvitation" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueQrcode from "vue-qrcode";

@Component({ components: { VueQrcode } })
export default class Connect extends Vue {
  private connectionInvitation!: string;

  created() {
    // TODO: erplace with invitation link
    this.connectionInvitation = "https://www.google.ca"; 
  }
}
</script>
