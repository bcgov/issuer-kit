const PROXY_CONFIG = {
  '/api': {
    target: 'http://localhost:5000',
    secure: false
  },
  '/appconfig': {
    target: 'http://localhost:4251',
    secure: false,
    bypass: function(req, res, proxyOptions) {
      console.log('Returning app configuration.');
      const appConfig = {
        keycloak: {
          url: 'http://localhost:8180/auth',
          realm: 'identity-kit',
          clientId: 'identity-kit-public'
        }
      };
      res.end(JSON.stringify(appConfig));
      return true;
    }
  }
};

module.exports = PROXY_CONFIG;
