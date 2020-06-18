void call(String repositoryUrl, String branch, String workingDirectory, String contextDirectory) {
  echo "Performing a sparse checkout ..."
  echo "Url: ${repositoryUrl}"
  echo "Branch: ${branch}"
  echo "Context Directory: ${contextDirectory}"
  echo "Working Directory: ${workingDirectory}"

  checkout([
    $class: 'GitSCM',
    checkout: false,
    submoduleCfg: [],
    userRemoteConfigs: [[url: "${repositoryUrl}"]],
    branches: [[name: "*/${branch}"]],
    extensions: [
      [$class: 'RelativeTargetDirectory', relativeTargetDir: "${workingDirectory}"],
      [$class: 'SparseCheckoutPaths',  sparseCheckoutPaths:[[$class:'SparseCheckoutPath', path:"${contextDirectory}"]]],
      [$class: 'CloneOption', depth: 0, noTags: true, reference: '', shallow: true]
    ]
  ])
}
