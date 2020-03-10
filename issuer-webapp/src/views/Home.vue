<template>
  <div class="home">
    <Welcome msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Welcome from "@/components/Welcome.vue";

@Component({ components: { Welcome } })
export default class Home extends Vue {}
</script>
