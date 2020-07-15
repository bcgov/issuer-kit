// Initializes the `IssuerInvite` service on path `/issuer-invite`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { IssuerInvite } from './issuer-invite.class';
import hooks from './issuer-invite.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'issuer-invite': IssuerInvite & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate'),
    whitelist: ['$regex']
  };

  // Initialize our service with any options it requires
  app.use('/issuer-invite', new IssuerInvite(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('issuer-invite');

  service.hooks(hooks);
}
