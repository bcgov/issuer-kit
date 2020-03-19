export interface AppConfig {
  env: string;
  issuer: {
    name: string;
  };
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
  testLink: string;
}
