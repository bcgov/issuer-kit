import OidcCallback from "@/components/auth/OidcCallback.vue";
import OidcCallbackError from "@/components/auth/OidcCallbackError.vue";
import { AppConfig } from "@/models/appConfig";
import IssuerStore from "@/store";
import Home from "@/views/Home.vue";
import Unauthorized from "@/views/Unauthorized.vue";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { vuexOidcCreateRouterMiddleware } from "vuex-oidc";
import hasAdminRole from "./guards/is-admin";

function router(config: AppConfig): VueRouter {
  Vue.use(VueRouter);

  // Application routes
  const appRoutes = [
    {
      path: "/",
      name: "Home",
      component: Home,
      beforeEnter: hasAdminRole
    },
    {
      path: "/invite",
      name: "Invite",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "invite" */ "../views/Invite.vue"),
      beforeEnter: hasAdminRole
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
