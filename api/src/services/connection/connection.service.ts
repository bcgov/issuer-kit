// Initializes the `connection` service on path `/connection`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Connection } from './connection.class';
import hooks from './connection.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'connection': Connection & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/connection', new Connection(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('connection');

  service.hooks(hooks);
}
