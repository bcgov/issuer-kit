_includeFile=$(type -p overrides.inc)
if [ ! -z ${_includeFile} ]; then
  . ${_includeFile}
else
  _red='\033[0;31m'; _yellow='\033[1;33m'; _nc='\033[0m'; echo -e \\n"${_red}overrides.inc could not be found on the path.${_nc}\n${_yellow}Please ensure the openshift-developer-tools are installed on and registered on your path.${_nc}\n${_yellow}https://github.com/BCDevOps/openshift-developer-tools${_nc}"; exit 1;
fi

# ================================================================================================================
# Special deployment parameters needed for injecting a user supplied settings into the deployment configuration
# ----------------------------------------------------------------------------------------------------------------
# The results need to be encoded as OpenShift template parameters for use with oc process.
# ================================================================================================================

if createOperation; then
  # Randomly generate a set of credentials without asking ...
  printStatusMsg "Creating a set of random user credentials ..."
  writeParameter "USER_ID" $(generateUsername) "false"
  writeParameter "USER_PASSWORD" $(generatePassword) "false"
  writeParameter "ADMIN_USER_ID" $(generateUsername) "false"
  writeParameter "ADMIN_PASSWORD" $(generatePassword) "false"

  # Get the settings for delivering user feedback to the business
  readParameter "FEEDBACK_TARGET_EMAIL - Please provide the target email address where user feedback will be sent.  The default is a blank string." FEEDBACK_TARGET_EMAIL "false"
  readParameter "SMTP_SERVER_ADDRESS - Please provide the address of the outgoing smtp server.  The default is a blank string." SMTP_SERVER_ADDRESS "false"
else
  # Secrets are removed from the configurations during update operations ...
  printStatusMsg "Update operation detected ...\nSkipping the generation of random user credentials.\nSkipping the prompts for FEEDBACK_TARGET_EMAIL, and SMTP_SERVER_ADDRESS secrets ...\n"
  writeParameter "USER_ID" "generation_skipped" "false"
  writeParameter "USER_PASSWORD" "generation_skipped" "false"
  writeParameter "ADMIN_USER_ID" "generation_skipped" "false"
  writeParameter "ADMIN_PASSWORD" "generation_skipped" "false"

  writeParameter "FEEDBACK_TARGET_EMAIL" "prompt_skipped" "false"
  writeParameter "SMTP_SERVER_ADDRESS" "prompt_skipped" "false"
fi

SPECIALDEPLOYPARMS="--param-file=${_overrideParamFile}"
echo ${SPECIALDEPLOYPARMS}