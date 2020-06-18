import com.openshift.jenkins.plugins.OpenShiftDSL;

void call(OpenShiftDSL openshift, String buildConfigName, int waitTimeout = 10, String contextDirectory = '', String envVars = '') {
  
  def buildFromDir = ''

  // Find all of the build configurations associated to the application ...
  echo "Looking up build configurations for ${buildConfigName} ..."
  def buildconfigs = openshift.selector("bc", "${buildConfigName}")
  echo "Found ${buildconfigs.count()} buildconfigs: ${buildconfigs.names()}"

  // Inject environment variables into the build as needed ...
  if (envVars?.trim()) {
    echo "Setting environment variables on bc/${buildConfigName} ..."
    echo "envVars: ${envVars}"
    buildconfigs.set("env bc/${buildConfigName} ${envVars}")
  }

  // Perform a binary build as needed ...
  if (contextDirectory?.trim()) {
    echo "Setting up for binary build using the source in the ${contextDirectory} directory ..."
    buildFromDir = "--from-dir='${contextDirectory}'"
    echo "buildFromDir: ${buildFromDir}"
  }

  // Kick off all the builds in parallel ...
  def builds = buildconfigs.startBuild("${buildFromDir}")
  echo "Started ${builds.count()} builds: ${builds.names()}"

  timeout(waitTimeout) {
    // Wait for all the builds to complete ...
    // This section will exit after the last build completes.
    echo "Waiting for builds to complete ..."
    builds.withEach {
      // untilEach and watch - do not support watching multiple named resources,
      // so we have to feed it one at a time.
      it.untilEach(1) {
          echo "${it.object().status.phase} - ${it.name()}"
          return (it.object().status.phase == "Complete")
      }
    }
  }

  echo "Builds complete ..."
}