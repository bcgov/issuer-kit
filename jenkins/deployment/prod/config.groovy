// Pipeline Configuration Properties
// Import this file into the pipeline using 'load'.
class config extends bc.baseConfig {
  // Deployment configuration
  public static final String SOURCE_TAG = "${super.DEPLOYMENT_ENVIRONMENT_TAGS[0]}"
  public static final String DESTINATION_TAG = "${super.DEPLOYMENT_ENVIRONMENT_TAGS[1]}"
}

return new config();