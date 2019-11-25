import adminApp from './app/admin/admin';
import * as adminRoutes from './app/admin/routes';
import * as clientRoutes from './app/client/routes';
import { DBClient } from './app/models/database/database.model';
import watchers from './core/watchers/database.watchers';

// activate routes
[...adminRoutes.routes, ...clientRoutes.routes].forEach(route =>
  adminApp.use(route),
);
[
  ...adminRoutes.allowedMethods,
  ...clientRoutes.allowedMethods,
].forEach(method => adminApp.use(method));

/**
 * Initialize connection to database
 */

let dbOptions = {
  uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVICE}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};

export const client = DBClient.getInstance(dbOptions);

client.connect().then(() => {
  console.log(`DB connected on ${dbOptions.uri}`);
  adminApp.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
  });
});

watchers.invitationWatcher.on(record => {
  // console.log(record);
  client.insertRecord(record);
});
