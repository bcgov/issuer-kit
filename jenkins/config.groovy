// Pipeline Configuration Properties
// Import this file into the pipeline using 'load'.
class config {

  // Wait timeout in minutes
  public static final int WAIT_TIMEOUT = 10

  // Deployment configuration
  public static final String[] DEPLOYMENT_ENVIRONMENT_TAGS = ['dev', 'test', 'prod']
  // public static final String DEV_ENV = "${DEPLOYMENT_ENVIRONMENT_TAGS[0]}"
  // public static final String TEST_ENV = "${DEPLOYMENT_ENVIRONMENT_TAGS[1]}"
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
  // Databases are not included since they will not likely change often.
  public static final String[] APPS = ['identity-kit-admin', 'identity-kit-public', 'identity-kit-controller', 'identity-kit-agent']
  public static final Map<String, String> APP_CONTEXT_DIRS = ['identity-kit-admin-angular':'wa-admin', 'identity-kit-admin':'wa-admin', 'identity-kit-public-angular':'wa-public', 'identity-kit-public':'wa-public', 'identity-kit-controller':'identity-controller', 'identity-kit-agent':'docker/agent']

  // Build configuration
  public static final String  APP_NAME = "${this.APPS}"
  public static final String[] BUILDS = ["${this.APPS}"]
}

return new config();