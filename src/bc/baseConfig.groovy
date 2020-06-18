
package bc;

class baseConfig {
  // Wait timeout in minutes
  public static final int WAIT_TIMEOUT = 10

  // Deployment Environment TAGs
  public static final String[] DEPLOYMENT_ENVIRONMENT_TAGS = ['test', 'prod']

  // The name of the project namespace(s).
  public static final String  NAME_SPACE = 'devex-von'

  // Apps - Listed in the order they should be tagged
  public static final String[] APPS = ['issuer-agent', 'issuer-api', 'issuer-db', 'issuer-wallet', 'issuer-web', 'issuer-admin']
}