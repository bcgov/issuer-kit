<style scoped lang="scss"></style>

<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :loading="loading"
        loading-text="Loading... Please wait"
        :headers="headers"
        :items="invites"
        :items-per-page.sync="options.itemsPerPage"
        :options.sync="options"
        :server-items-length="totalInvites"
        :search="search"
        class="elevation-1"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [5, 10, 15]
        }"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Invites</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" :to="{ path: 'invite' }"
              >New Invite</v-btn
            >
          </v-toolbar>
        </template>

        <template v-slot:item.issued="{ item }">
          <v-simple-checkbox v-model="item.issued" disabled></v-simple-checkbox>
        </template>
        <template v-slot:item.expired="{ item }">
          <v-simple-checkbox
            v-model="item.expired"
            disabled
          ></v-simple-checkbox>
        </template>
        <template v-slot:item.revoked="{ item }">
          <v-simple-checkbox
            v-if="item.revoked != null"
            v-model="item.revoked"
            disabled
          ></v-simple-checkbox>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small v-if="item.revoked === undefined"  @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { IssuerInvite } from "../models/issuer-invite";
import { IssuerInviteListServiceResponse } from "../models/api";
import { DataOptions } from "vuetify";

@Component({})
export default class Home extends Vue {
  private search = "";
  private loading = true;
  private options = {};
  private headers = [
    { text: "Email", align: "start", value: "email" },
    { text: "Issued", value: "issued" },
    { text: "Expired", value: "expired" },
    { text: "Revoked", value: "revoked" },
    { text: "Actions", value: "actions", sortable: false }
  ];
  private invites = new Array<IssuerInvite>();
  private totalInvites = 0;

  mounted() {
    this.fetchData({
      dataOptions: this.options as DataOptions
    }).then((response: IssuerInviteListServiceResponse) => {
      this.invites = response.data;
      this.totalInvites = response.total;
      this.loading = false;
    });
  }

  editItem(item: IssuerInvite) {
    this.$router.push({ path: "invite", query: { id: item._id } });
  }

  async deleteItem(item: IssuerInvite) {
    this.fetchData({
      dataOptions: this.options as DataOptions
    }).then(() => {
      const itemIdx = this.invites.findIndex(el => item._id === el._id);
      this.invites.splice(itemIdx, 1);
      this.$store.dispatch("issuerInvite/deleteInvite", item._id);
    });
  }

  fetchData(options: {
    dataOptions: DataOptions;
    searchString?: string;
  }): Promise<IssuerInviteListServiceResponse> {
    return this.$store.dispatch("issuerInvite/fetchInvites", options);
  }

  @Watch("options")
  handler(value: DataOptions, oldValue: DataOptions) {
    this.loading = true;
    this.fetchData({ dataOptions: value }).then(
      (response: IssuerInviteListServiceResponse) => {
        this.invites = response.data;
        this.totalInvites = response.total;
        this.loading = false;
      }
    );
  }

  @Watch("search")
  searchHandler(value: string, oldValue: string) {
    this.loading = true;
    this.fetchData({
      dataOptions: this.options as DataOptions,
      searchString: value
    }).then((response: IssuerInviteListServiceResponse) => {
      this.invites = response.data;
      this.totalInvites = response.total;
      this.loading = false;
    });
  }
}
</script>
