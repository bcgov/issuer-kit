import admin from './app/admin/admin';
import { DBClient } from './app/models/database/database.model';
import watchers from './core/watchers/database.watchers';
import {
  AppConfigurationService,
  APP_SETTINGS,
} from './core/services/app-configuration-service';

const dbUser = AppConfigurationService.getSetting(APP_SETTINGS.DB_USER);
const dbPassword = AppConfigurationService.getSetting(APP_SETTINGS.DB_PASSWORD);
const dbService = AppConfigurationService.getSetting(APP_SETTINGS.DB_SERVICE);
const dbPort = AppConfigurationService.getSetting(APP_SETTINGS.DB_PORT);
const dbName = AppConfigurationService.getSetting(APP_SETTINGS.DB_NAME);
const dbOptions = {
  uri: `mongodb://${dbUser}:${dbPassword}@${dbService}:${dbPort}/${dbName}`,
};

export const client = DBClient.getInstance(dbOptions);

client.connect().then(() => {
  console.log(`DB connected on ${dbOptions.uri}`);
  admin.listen(AppConfigurationService.getSetting(APP_SETTINGS.PORT), () => {
    console.log(
      `Listening on port: ${AppConfigurationService.getSetting(
        APP_SETTINGS.PORT,
      )}`,
    );
  });
});

watchers.invitationWatcher.on(record => {
  // console.log(record);
  client.insertRecord(record);
});
