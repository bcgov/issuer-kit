// Initializes the `TokenValidation` service on path `/token/:token/validate`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TokenValidation } from './token-validation.class';
import hooks from './token-validation.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'token/:token/validate': TokenValidation & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {};

  // Initialize our service with any options it requires
  app.use('/token/:token/validate', new TokenValidation(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('token/:token/validate');

  service.hooks(hooks);
}
