"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const HttpStatus = require("http-status-codes");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const invitation_controller_1 = require("./invitation/invitation.controller");
const admin = new Koa();
const client = true;
// Generic error handling middleware.
const options = {
    origin: '*',
    allowHeaders: [
        'Content-Type',
        'content-type',
        'Authorization',
        'Accept',
        'Origin'
    ],
    allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS'
};
admin.use(bodyParser());
admin.use(cors(options));
admin.use(async (ctx, next) => {
    try {
        await next();
    }
    catch (error) {
        ctx.status =
            error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        error.status = ctx.status;
        ctx.body = { error };
        ctx.app.emit('error', error, ctx);
        console.log(error);
    }
});
/*
if (client) {
  clientRoutes.forEach(route => app.use(route));
  clientMethods.forEach(route => app.use(route));
}
*/
admin.use(invitation_controller_1.default.routes());
admin.use(invitation_controller_1.default.allowedMethods());
// Application error logging.
admin.on('error', console.error);
exports.default = admin;
