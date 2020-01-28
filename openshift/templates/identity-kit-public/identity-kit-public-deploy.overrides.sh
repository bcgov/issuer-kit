_includeFile=$(type -p overrides.inc)
if [ ! -z ${_includeFile} ]; then
  . ${_includeFile}
else
  _red='\033[0;31m'; _yellow='\033[1;33m'; _nc='\033[0m'; echo -e \\n"${_red}overrides.inc could not be found on the path.${_nc}\n${_yellow}Please ensure the openshift-developer-tools are installed on and registered on your path.${_nc}\n${_yellow}https://github.com/BCDevOps/openshift-developer-tools${_nc}"; exit 1;
fi

OUTPUT_FORMAT=json

# The generated config maps are used to replace Caddyfile and config.json
CADDY_SOURCE_FILE=$( dirname "$0" )/../../../docker/wa-public/config/Caddyfile
CADDY_OUTPUT_FILE=${CADDY_CONFIG_MAP_NAME}-configmap_DeploymentConfig.json
printStatusMsg "Generating ConfigMap; ${CADDY_CONFIG_MAP_NAME} ..."
generateConfigMap "${CADDY_CONFIG_MAP_NAME}${SUFFIX}" "${CADDY_SOURCE_FILE}" "${OUTPUT_FORMAT}" "${CADDY_OUTPUT_FILE}"

APPCONFIG_SOURCE_FILE=$( dirname "$0" )/../../../wa-public/src/assets/config/config.json
APPCONFIG_OUTPUT_FILE=${APPCONFIG_CONFIG_MAP_NAME}-configmap_DeploymentConfig.json
printStatusMsg "Generating ConfigMap; ${APPCONFIG_CONFIG_MAP_NAME} ..."
generateConfigMap "${APPCONFIG_CONFIG_MAP_NAME}${SUFFIX}" "${APPCONFIG_SOURCE_FILE}" "${OUTPUT_FORMAT}" "${APPCONFIG_OUTPUT_FILE}"

unset SPECIALDEPLOYPARMS
echo ${SPECIALDEPLOYPARMS}
