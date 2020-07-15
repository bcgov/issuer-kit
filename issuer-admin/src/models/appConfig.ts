export interface AppConfig {
  env: string;
  issuer: {
    name: string;
    publicUrl: string;
  };
  inviteRequired: boolean;
  authentication: {
    enabled: boolean;
    oidcSettings: {
      authority: string;
      clientId: string;
      redirectUri: string;
      redirect_uri: string;
      responseType: string;
      scope: string;
      automaticSilentRenew: string;
      silentRedirectUri: string;
      post_logout_redirect_uri: string;
    };
  };
  apiServer: {
    url: string;
  };
}

export class Configuration {
  public app!: AppConfig;
  public claims!: any; //eslint-disable-line @typescript-eslint/no-explicit-any
}
