<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Invites
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :loading="loading"
        loading-text="Loading... Please wait"
        :headers="headers"
        :items="invites"
        :search="search"
        class="elevation-1"
        :footer-props="{
          showFirstLastPage: true,
        }"
      >
        <template v-slot:item.issued="{ item }">
          <v-simple-checkbox
            v-model="item.issued"
            disabled
          ></v-simple-checkbox>
        </template>
        <template v-slot:item.expired="{ item }">
          <v-simple-checkbox
            v-model="item.expired"
            disabled
          ></v-simple-checkbox>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Axios from "axios";

@Component({})
export default class Home extends Vue {
  private search = "";
  private loading = true;
  private headers = [
    {
      text: "Name",
      align: "start",
      value: "name",
    },
    { text: "Email", value: "email" },
    { text: "Issued", value: "issued" },
    { text: "Expired", value: "expired" },
    { text: "Actions", value: "actions", sortable: false },
  ];
  private invites = [];

  mounted() {
    setTimeout(() => {
      this.invites.push({
        name: "Emiliano Sune",
        email: "emiliano.sune@gmail.com",
        issued: false,
        expired: false,
      });
      this.loading = false;
    }, 2000);
  }

  editItem(item: any) {
    console.log("EDIT: ", item);
  }

  deleteItem(item: any) {
    console.log("DELETE: ", item);
  }
}
</script>
