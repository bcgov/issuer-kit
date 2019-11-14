import validateCtrl from "./validate/validate.controller";

export const clientRoutes = [validateCtrl.routes()];

export const clientMethods = [validateCtrl.allowedMethods()];
