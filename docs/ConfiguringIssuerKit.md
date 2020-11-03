# Configuring Issuer Kit

Issuer Kit can be configured and customized by modifying a few files in each of the services. The following is a list of configuration files, where they should go and what are the supported settings.

## Web Applications

All web applications in Issuer Kit (`issuer-admin` and `issuer-web`) are built on the same VueJS app skeleton, and therefore most of the configuration files between the two apps are in common.

All files inside the `public` folder can be overridden at deployment time: in the production-ready containers for Issuer Kit the location to place the new files (overriding the existing ones with the same names) is `/srv/config`.

### Common Settings

##### UI Theme

The UI theme for the web application can be lightly customized by tweaking the configuration in `config/vuetify.json`. The contents of this file are Vuetify heme configurations and will allow you to change the base color scheme for the app, as well as some other settings. Please refer to the [Vuetify docs](https://vuetifyjs.com/en/customization/theme/#theme) for further details. 

Additionally, `favicon.ico` and `logo.svg` can be replaced to customize the browser favorite icon for the webapp and the SVG logo appearing in the header of the webapp.

#### OIDC Plugin

The file `silent-renew-oidc.html` is responsible for silently renewing the access token automatically when using an Identity Provider to access the webapp. Modifying it is not recommended, however further docs can be found in the documentation for [vuex-oidc](https://github.com/perarnborg/vuex-oidc/wiki).

#### Unauthorized page

When an unauthorized user (IdP authentication failure, no authentication or no valid invitation) tries to access the web application, the unauthorized page will be displayed. The default page is generic and only displays a basic message, to further customize the contents of this page `unauthorized.html` can be used to inject custom HTML and CSS into the page.

The contents of the file will be displayed below the generic unauthorized message.

#### Home page

Similarly to the `unauthorized.html` configuration file we discussed earlier, `terms-and-confitions.html` defines custom HTML/CSS that will be injected in the main landing page for the issuer webapp. This can be used to add a welcome message or a disclaimer.

#### Dynamic Form Configuration

Both the admin and issuer webapp use [SurveyJS](https://surveyjs.io) to display forms that are dynamically generated from the configuration file referenced below.

`config/claim-config.json` is  SurveyJs configuration file, defining the behaviour of the surveyjs object. For more details on how to configure a survey, please refer to the [SurveyJS docs](https://surveyjs.io/Examples/Library).

`config/custom-scripts.js` is used to define custom JS scripts that can be used in the SurveyJS form to customize its behaviour using triggers. All functions need to be declared in the file, and added to the `surveyFunctions` array in order to be registered with the SurveyJS component when it is rendered.

#### Application configuration

`config.json` contains the bulk of the configuration for the web application. Most of the settings in this file are shared between the admin and issuer wbapps, with some exceptions.

* `env`: a string describing the environment the deployment is running in. This is just a label, useful to quickly identify which configuration is being used.

* `issuer`: an object containing information about the issuer. It currently only holds the `name` property, a string with the issuer's name.

* `inviteRequired` (issuer-web only): turns on/off the requirement for a valid, not used and not expired invite in order to access the issuer.

* `authentication`:
  * `enabled`: defines wether the OIDC plugin should be enabled, thus requiring successful authentication via the specified Identity Provider in order to access the application.
  
  * `oidcSettings`:  settings for the OIDC client. Details can be found in the [library docs](https://github.com/IdentityModel/oidc-client-js/wiki).

* `apiServer`: an object containing configuration details for the API server used by the web application. Currently only the `url` endpoint is used, and it's value changed between production mode and local development mode.

* `credentials` (issuer-web only): OPTIONAL - this object contains the configuration that determines which schema will be requested when sending the credential-request to the agent. If not specified, the schema marked as default in the API/controller will be used.

 * `schema_id`: the schema_id as published on the target ledger.

* `issuedSuccess` (issuer-web only): an object holding additional settings to be used when displaying the success page after issuing a credential.

  * `successText`: the text to be displayed as success message.

  * `links`: an array of objects of the type `{ "url": "http://my-url.org", "description": "My URL Name" }`. It will be used to display useful links after the success message.

## API/Controller

### Configuration

The API/controller service is written using [FeathersJS](https://github.com/feathersjs/feathers) and follows the framework's conventions to define configurations. For details on the configuration file syntax, please refer to the [FeathersJS docs](https://docs.feathersjs.com/api/configuration.html#example).

The main "tweak" is that, while the framework still supports using overrides for each environment, most of the configurations that could change between dev/test/prod are injected via environment variables.

In the production-ready containers for Issuer Kit the location to place the new files (overriding the existing ones with the same names) is `/opt/app-root/src/config`.

#### Main configuration file

Most of the configuration file is fairly simple, the following are the setting groups that require some additional details:

* `smtp`: this is a Nodemailer configuration that gets passed as-is to the underlying nodemailer plugin. For a reference of the available settings, please see the [Nodemailer docs](https://nodemailer.com/smtp/).

* `emailSettings`: this object contains configuration items used when generating and sending the invite email. `sender` and `subject` are required, but additional properties can be defined and used in the invite email (see details in the invite email section).

* `publicSite`: the base URl for the public issuer site, to be used when generating invite links.

* `issuer`: an object holding configuration settings for the issuer

  * `name`: the issuer name

  * `offerComment`: the comment/message sent with a new credential offer.

  * `validityDays`: the number of days after which the invite will not be valid anymore, preventing users from accessing the issuer website even when a "real" invite link is used. `-1` turns this setting off (infinite validity).

  * `multiUse`: determines wether a single invite can e used multiple times, or it will be disabled after the first credential is successfully issued.

* `authentication`: an object holding configuration settings for the OIDC authentication service

  * `jwksUri`: the JWKS uri for the service to be used when verifying id tokens

  * `algorithms`: an array containing one (or more) encryption algorithms supported by the authentication server

#### Schemas

Each issuer APi/controller can be used to issue several different credentials. The schemas determining such credentials are configured in `schemas.json`.

The JSON structure in the file can be used to target a `schema_id` that was already published on the ledger, or defining a new schema from scratch.

Example:
```
[
  {
    "id": "85459GxjNySJ8HwTTQ4vq7:2:verified_person:1.4.0",
    "default": true
  },
  {
    "schema_name": "my_schema",
    "schema_version": "0.01",
    "attributes": [
      "attr1",
      "attr2",
      "attr3"
    ],
    "revocable": true,
    "tag": "my-custom-tag,
    "public": true
  }
]
```

:information_source: one schema needs to be flagged with the `default: true` property in order for requests that don't explicitly specify a schema to be fulfilled.

##### Optional settings

* `revocable`: when set to `true`, a revocation registry will be generated and published, and the admin UI will display revocation controls once the credential has been issued.

* `tag`: this setting defines a custom tag to be applied when publishing a new credential definition for that schema.

* `public`: when set to `true`, the issuer will receive (and fulfill) credential requests for the specified schema id (or default, if not specified and the default schema is set to public). Otherwise, to successfully request a credential teh user will either need to be authenticated via invite or by signing-in using an Identity Provider (see the relevant settings in the configuration for the issuer web application).

#### Invite email

The file `invite-email.html` contains the HTM email template that will be used when sending email invites. The file supports templating by using any of the properties defined in the `emailSettings` configuration object, as well as `inviteUrl` to print the invite link to connect with the public issuer.

Any variable in the format `${myCustomProperty}` that is found in the template will be replaced with the corresponding property in `emailSettings`.
