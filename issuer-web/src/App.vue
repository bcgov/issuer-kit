<template>
  <v-app>
    <Header :helpDialog="displayHelp" />

    <v-main>
      <router-view @helpDialog="handleHelpDialog($event)"></router-view>
    </v-main>

    <Footer />
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

@Component({
  components: { Header, Footer }
})
export default class App extends Vue {
  private displayHelp = false;

  handleHelpDialog(toggleHelp: boolean) {
    this.displayHelp = toggleHelp;
  }
}
</script>
