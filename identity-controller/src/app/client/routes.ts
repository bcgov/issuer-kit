import validationController from './validate/validate.controller';

const routes = [validationController.routes()];

const allowedMethods = [validationController.allowedMethods()];

export { routes, allowedMethods };
