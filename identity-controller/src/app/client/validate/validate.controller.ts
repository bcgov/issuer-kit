import * as Koa from "koa";
import * as Router from "koa-router";

const routerOpts: Router.IRouterOptions = {
  prefix: "/validate"
};

const router: Router = new Router(routerOpts);

router.get("/", async (ctx: Koa.Context) => {
  return (ctx.body = "valid test");
});

export default router;
