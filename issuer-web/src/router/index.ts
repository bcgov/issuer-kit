import OidcCallback from "@/components/auth/OidcCallback.vue";
import OidcCallbackError from "@/components/auth/OidcCallbackError.vue";
import store from "@/store";
import Home from "@/views/Home.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import { vuexOidcCreateRouterMiddleware } from "vuex-oidc";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/credential-data",
    name: "Credential Data",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "data-entry" */ "../views/DataEntry.vue")
  },
  {
    path: "/confirm-data",
    name: "Confirm Data",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "confirm-data" */ "../views/ConfirmData.vue")
  },
  {
    path: "/connect",
    name: "Connect to Issuer",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "connect" */ "../views/Connect.vue")
  },
  {
    path: "/issue-credential",
    name: "Issuing Credential",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "issue-credential" */ "../views/IssueCredential.vue"
      )
  },
  {
    path: "/oidc-callback",
    name: "oidcCallback",
    component: OidcCallback
  },
  {
    path: "/oidc-callback-error", // Needs to match redirect_uri in you oidcSettings
    name: "oidcCallbackError",
    component: OidcCallbackError,
    meta: {
      isPublic: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach(vuexOidcCreateRouterMiddleware(store));

export default router;
