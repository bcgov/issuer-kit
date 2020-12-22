import OidcCallback from "@/components/auth/OidcCallback.vue";
import OidcCallbackError from "@/components/auth/OidcCallbackError.vue";
import { AppConfig } from "@/models/appConfig";
import IssuerStore from "@/store";
import { multiGuard } from "@/utils";
import Home from "@/views/Home.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { vuexOidcCreateRouterMiddleware } from "vuex-oidc";
import hasPresReq from "./guards/pres-req";
import validToken from "./guards/valid-token";

function router(config: AppConfig): VueRouter {
  Vue.use(VueRouter);

  // Application routes
  const appRoutes = [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        isPublic: true
      },
      beforeEnter: validToken
    },
    {
      // required for backwards compatibility with old issuer app
      path: "/validate",
      name: "Validate",
      component: Home,
      meta: {
        isPublic: true
      },
      beforeEnter: multiGuard([validToken, hasPresReq])
    },
    {
      path: "/credential-data",
      name: "Credential Data",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "data-entry" */ "../views/DataEntry.vue"),
      beforeEnter: multiGuard([validToken, hasPresReq])
    },
    {
      path: "/confirm-data",
      name: "Confirm Data",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "confirm-data" */ "../views/ConfirmData.vue"
        ),
      beforeEnter: multiGuard([validToken, hasPresReq])
    },
    {
      path: "/connect",
      name: "Connect to Issuer",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "connect" */ "../views/Connect.vue"),
      beforeEnter: multiGuard([validToken, hasPresReq])
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
        ),
      beforeEnter: multiGuard([validToken, hasPresReq])
    },
    {
      path: "/unauthorized",
      name: "Unauthorized",
      component: Unauthorized,
      meta: {
        isPublic: true
      }
    },
    {
      path: "*",
      name: "Undefined",
      component: Unauthorized,
      meta: {
        isPublic: true
      }
    }
  ] as RouteConfig[];

  // OIDC specific routes
  const oidcRoutes = [
    {
      path: "/oidc-callback", // Needs to match redirectUri in you oidcSettings
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
  ] as RouteConfig[];

  const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes: config.authentication.enabled
      ? appRoutes.concat(oidcRoutes)
      : appRoutes
  });

  if (config.authentication.enabled) {
    // enable oidc middleware
    router.beforeEach(
      vuexOidcCreateRouterMiddleware(IssuerStore.getInstance(), "oidcStore")
    );
  }

  return router;
}
export default router;
