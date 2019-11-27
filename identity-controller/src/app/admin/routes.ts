import invitationController from './invitation/invitation.controller';
import healthController from './health/health.controller';
import connectionController from './connections/connection.controller';
import issueController from './issues/issue.controller';

export const allowedRoutes = [
  invitationController.routes(),
  healthController.routes(),
  connectionController.routes(),
  issueController.routes()
];
export const allowedMethods = [
  invitationController.allowedMethods(),
  healthController.allowedMethods(),
  connectionController.allowedMethods(),
  issueController.allowedMethods()
];
