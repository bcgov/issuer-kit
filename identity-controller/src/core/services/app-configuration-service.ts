/**
 * Helper providing a list of all the user-configurable settings.
 * Add new environment variables here for the AppConfigurationService
 * to pick them up and make them available across the application.
 */
export enum APP_SETTINGS {
  PORT = 'PORT',
  AGENT_ADMIN_URL = 'AGENT_ADMIN_URL',
  AGENT_ADMIN_API_KEY = 'AGENT_ADMIN_API_KEY',
  DB_SERVICE = 'DB_SERVICE',
  DB_NAME = 'DB_NAME',
  DB_USER = 'DB_USER',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_PORT = 'DB_PORT',
  SMTP_HOST = 'SMTP_HOST',
  SMTP_PORT = 'SMTP_PORT',
  PUBLIC_SITE_URL = 'PUBLIC_SITE_URL',
  ADMIN_EMAIL = 'ADMIN_EMAIL',
  SMTP_USERNAME = 'SMTP_USERNAME',
  SMTP_PASS = 'SMTP_PASS',
  EXISTING_SCHEMA_ID = 'EXISTING_SCHEMA_ID',
  CUSTOM_SCHEMA_PATH = 'CUSTOM_SCHEMA_PATH',
}

/**
 * Helper class to provide a single point for all
 * configurations for the controller.
 */
export class AppConfigurationService {
  private static instance: AppConfigurationService;
  private settings: Map<string, string>;

  private constructor() {
    this.loadEnvironmentVariables();
  }

  private static getInstance() {
    if (!AppConfigurationService.instance) {
      AppConfigurationService.instance = new AppConfigurationService();
    }
    return AppConfigurationService.instance;
  }

  private loadEnvironmentVariables() {
    this.settings = new Map<string, string>();
    Object.keys(APP_SETTINGS).forEach(key => {
      if (key && isNaN(Number(key))) {
        this.settings.set(key, process.env[key] || '');
      }
    });
  }

  public static getSetting(setting: string): string {
    return this.getInstance().settings.get(setting) || '';
  }
}
