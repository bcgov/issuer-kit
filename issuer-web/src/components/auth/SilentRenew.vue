<style scoped lang="scss"></style>

<template> </template>

<script lang="ts">
import { vuexOidcProcessSilentSignInCallback } from "vuex-oidc";
import config from "@/assets/config/config.json";

vuexOidcProcessSilentSignInCallback(config.authentication.oidcSettings);
</script>
