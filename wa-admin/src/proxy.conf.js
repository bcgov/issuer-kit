const PROXY_CONFIG = {
  '/api': {
    target: 'http://identity-controller-dev:5000',
    secure: false,
    pathRewrite: {
      '^/api': ''
    }
  },
  '/appconfig': {
    target: 'http://localhost:4250',
    secure: false,
    bypass: function(req, res, proxyOptions) {
      if (req.url.endsWith('/appconfig')) {
        console.log('Returning app configuration.');
        const appConfig = {
          keycloak: {
            url: 'http://localhost:8180/auth',
            realm: 'identity-kit',
            clientId: 'identity-kit-admin'
          }
        };
        res.end(JSON.stringify(appConfig));
        return true;
      }
    }
  }
};

module.exports = PROXY_CONFIG;
