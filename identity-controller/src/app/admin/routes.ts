import invitationController from './invitation/invitation.controller';
import healthController from './health/health.controller';

const routes = [invitationController.routes(), healthController.routes()];

const allowedMethods = [
  invitationController.allowedMethods(),
  healthController.allowedMethods(),
];

export { routes, allowedMethods };
