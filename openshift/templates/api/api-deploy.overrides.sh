_includeFile=$(type -p overrides.inc)
if [ ! -z ${_includeFile} ]; then
  . ${_includeFile}
else
  _red='\033[0;31m'; _yellow='\033[1;33m'; _nc='\033[0m'; echo -e \\n"${_red}overrides.inc could not be found on the path.${_nc}\n${_yellow}Please ensure the openshift-developer-tools are installed on and registered on your path.${_nc}\n${_yellow}https://github.com/BCDevOps/openshift-developer-tools${_nc}"; exit 1;
fi

OUTPUT_FORMAT=json

# Generate application config map
# - To include all of the files in the application instance's profile directory.
# Injected by genDepls.sh
# - APP_CONFIG_MAP_NAME
# - SUFFIX
# - DEPLOYMENT_ENV_NAME

# Combine the profile's default config files with its environment specific config files before generating the config map ...
profileRoot=$( dirname "$0" )/config/${PROFILE}
profileEnv=${profileRoot}/${DEPLOYMENT_ENV_NAME}
profileTmp=$( dirname "$0" )/config/${PROFILE}/tmp
mkdir -p ${profileTmp}
cp -f ${profileRoot}/* ${profileTmp} 2>/dev/null
cp -f ${profileEnv}/* ${profileTmp} 2>/dev/null

# Generate the config map ...
APPCONFIG_SOURCE_PATH=${profileTmp}
APPCONFIG_OUTPUT_FILE=${APP_CONFIG_MAP_NAME}-configmap_DeploymentConfig.json
printStatusMsg "Generating ConfigMap; ${APP_CONFIG_MAP_NAME} ..."
generateConfigMap "${APP_CONFIG_MAP_NAME}${SUFFIX}" "${APPCONFIG_SOURCE_PATH}" "${OUTPUT_FORMAT}" "${APPCONFIG_OUTPUT_FILE}"

# Remove temporary configuration directory and files ....
rm -rf ${profileTmp}
unset SPECIALDEPLOYPARMS

if createOperation; then
  # Get the settings for delivering user feedback to the business
  readParameter "ADMIN_EMAIL - Please provide the email address to be used as sender for outgoing messages.  The default is a blank string." ADMIN_EMAIL "false"
  readParameter "SMTP_SERVER_ADDRESS - Please provide the address of the outgoing smtp server.  The default is a blank string." SMTP_SERVER_ADDRESS "false"
  readParameter "SMTP_SERVER_PORT - Please provide the address of the outgoing smtp server PORT.  The default is a blank string." SMTP_SERVER_PORT "false"
else
  # Secrets are removed from the configurations during update operations ...
  printStatusMsg "Update operation detected ...Skipping the prompts for ADMIN_EMAIL, SMTP_SERVER_ADDRESS, and SMTP_SERVER_PORT environment variables ...\n"
  writeParameter "ADMIN_EMAIL" "prompt_skipped" "false"
  writeParameter "SMTP_SERVER_ADDRESS" "prompt_skipped" "false"
  writeParameter "SMTP_SERVER_PORT" "prompt_skipped" "false"
fi

SPECIALDEPLOYPARMS="--param-file=${_overrideParamFile}"
echo ${SPECIALDEPLOYPARMS}
