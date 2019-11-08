"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const routerOpts = {
    prefix: '/validate'
};
const router = new Router(routerOpts);
router.get('/', async (ctx) => {
    return (ctx.body = 'valid test');
});
