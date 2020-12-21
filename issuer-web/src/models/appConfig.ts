export interface AppConfig {
  env: string;
  issuer: {
    name: string;
  };
  help: {
    enabled: boolean;
    displayOnFirstVisit: boolean;
  };
  inviteRequired: boolean;
  authentication: {
    enabled: boolean;
    autoSignOut: boolean;
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
      extraQueryParams: {
        pres_req_conf_id: string;
      };
    };
  };
  apiServer: {
    url: string;
  };
  issuedSuccess: {
    successText: string;
    links: Array<any>; // eslint-disable-line
  };
  credentials: {
    schema_id: string;
  };
}

export class Configuration {
  public app!: AppConfig;
  public claims!: any; //eslint-disable-line @typescript-eslint/no-explicit-any
}
