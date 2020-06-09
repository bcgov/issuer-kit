// Pipeline Configuration Properties
// Import this file into the pipeline using 'load'.
class config {

  // Wait timeout in minutes
  public static final int WAIT_TIMEOUT = 10

  // Deployment configuration
  public static final String[] DEPLOYMENT_ENVIRONMENT_TAGS = ['dev', 'test', 'prod']
  // public static final String DEV_ENV = "${DEPLOYMENT_ENVIRONMENT_TAGS[0]}"
  public static final String TEST_ENV = "${DEPLOYMENT_ENVIRONMENT_TAGS[1]}"
  public static final String PROD_ENV = "${DEPLOYMENT_ENVIRONMENT_TAGS[2]}"

  // The name of the project namespace(s).
  public static final String  NAME_SPACE = 'devex-von'

  // The application label
  // This is used to find all of the build configurations associated to the application
  // To work the build configurations must have an "app" label;
  // - For example; app=identity-kit
  public static final String APP_LABEL = 'identity-kit'
  public static final String BASE_IMAGE_SELECTOR = "${APP_LABEL}-base-image"
  public static final String RUNTIME_IMAGE_SELECTOR = "${APP_LABEL}-runtime"

  // List of apps that will require to be deployed.
  // The map binds an image with the set of deployments that are related to it
  public static final Map<String, String[]> TEST_APPS = ['issuer-admin':['issuer-admin-bc'], 'issuer-web':['issuer-web-bc'], 'issuer-api':['identity-kit-controller-bc'], 'issuer-agent':['identity-kit-agent-bc']]
  public static final Map<String, String[]> PROD_APPS = ['issuer-admin':['issuer-admin-bc'], 'issuer-web':['issuer-web-bc'], 'issuer-api':['identity-kit-controller-bc'], 'issuer-agent':['identity-kit-agent-bc']]
  
  // Mapping for source code context directories
  public static final Map<String, String> APP_CONTEXT_DIRS = ['issuer-admin-base-image':'issuer-admin', 'issuer-admin':'issuer-admin', 'issuer-web-base-image':'issuer-web', 'issuer-web':'issuer-web', 'identity-kit-controller':'api', 'identity-kit-agent':'docker/agent']

}

return new config();