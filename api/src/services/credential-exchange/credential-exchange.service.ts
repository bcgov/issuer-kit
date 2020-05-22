// Initializes the `credential-exchange` service on path `/credential-exchange`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CredentialExchange } from './credential-exchange.class';
import hooks from './credential-exchange.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'credential-exchange': CredentialExchange & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/credential-exchange', new CredentialExchange(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('credential-exchange');

  service.hooks(hooks);
}
