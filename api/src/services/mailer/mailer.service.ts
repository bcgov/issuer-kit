// Initializes the `mailer` service on path `/mailer`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import hooks from './mailer.hooks';
// @ts-ignore
import mailer = require("feathers-mailer");

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'mailer': mailer & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const sender = app.get('emailSettings').sender;
  const transporter = app.get('smtp');

  // Initialize our service with any options it requires
  app.use('mailer', mailer(transporter, { from: sender }));

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');

  service.hooks(hooks);
}
