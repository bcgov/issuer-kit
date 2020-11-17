# BC Gov Issuer Kit

This repo contains code and deployment instructions for running the BC Gov's Issuer Kit Verifiable Credentials proof of concept (PoC). The ID Kit PoC includes:

- An administrator application that allows the organization operating the PoC to invite (via email) and track participants to be issued a verifiable credential.
- An issuer application used by participants to set the claims in, and be issued, a verifiable credential.
- Links to applications at which the verifiable credential can be used for login using a [verifiable credential-enabled OpenID Connect Identity Provider](https://github.com/bcgov/vc-authn-oidc) (IdP).

The instructions below allow you to run the application on your laptop in a couple of different ways. Once you are familiar with the app, you can configure the code to be deployed on enterprise hardware, with updates applicable to your environment.

An overview of the architecture of the IdKit and the administrator and participant flows can be found [here](docs/issuer-kit.md).

Need a mobile app to try? Instructions are available [here](../issuer-kit/docs/GettingApp.md) for getting an IOS mobile app. An Android app will be available Real Soon Now.

> The instructions here are still a bit raw. We're iterating on them and check back if things don't go smoothly. We're happy to answer any questions you have. Easiest way to connect with us is to add an [issue](https://github.com/bcgov/issuer-kit/issues) in this repo.

## Pre-Requisites

- [Docker](https://www.docker.com/products/docker-desktop)

- [s2i](https://github.com/openshift/source-to-image/releases)

- [jq](https://stedolan.github.io/jq)

- [ngrok](https://ngrok.com)

- [von-network](https://github.com/bcgov/von-network) - Local Mode only (see below)

`jq` and `ngrok` are available on package manager systems for different platforms such as [Homebrew](https://brew.sh/) (Mac), [Chocolatey](https://chocolatey.org/) (Windows) and various Linux distribution package managers.

## Running the Issuer Kit

Issuer Kit can be started in different (demo, local and developer) modes by executing the steps in the respective sections below. The following are a couple important things to keep in mind as you start the apps:

- When starting the system, there is an initial pause with a message to give you a chance to setup some GitHub integration capabilities. That is needed only if you want test out logging into the admin and issuer applications using GitHub credentials. When getting started, we recommend that you just wait for the start up process to continue.

- A local maildev server will be running at http://localhost:8050: you can use it to monitor the outgoing emails sent from the admin app when creating a new invite.

- The apps (administrator and issuer) are protected by a locally running instance of Red Hat's Keycloak Identity and Access Management (IAM) component that is started as part of the Docker compose process. Credentials are pre-configured for the two applications with appropriate access as follows:
  - For the administrator app use: `issuer-admin`/`issuer-admin`
  - For the issuer app use: `issuer-user`/`issuer-user`

### Demo Mode

Demo mode runs Issuer Kit using the [BCovrin Test](http://test.bcovrin.vonx.io) ledger and uses `ngrok` to expose the agent running locally to the Internet. The Streetcred mobile agent (iOS and Android) can be used with Issuer Kit if you use demo mode.

To run in demo mode, open two shell/terminal sessions:

1. From within the [scripts](./scripts) folder execute `./start-ngrok.sh`. This will create a tunnel for the agent.

2. From within the [docker](./docker) folder:
    - run `./manage build` to assemble the runtime images for the services
    - when the build completes, run `./manage start-demo`

Once started, the services will be exposed on localhost at the following endpoints:

- `api`: http://localhost:5000

- `issuer-admin` Administrator app: http://localhost:8081

- `issuer-web` Issuer app: http://localhost:8082

- `db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `agent`: http://localhost:8024

- `maildev`: http://localhost:8050

Within the Streetcred app, check the settings to see what Ledger you are using. For this demo the Streetcred app must be set to use the "BCovrin Test" network, as follows:

- Go to settings by clicking the menu icon in the top right (the "hamburger" icon&mdash;three stacked horizontal lines)
- Click on the "Network" item and from the subsequent list select "BCovrin Test" network.
- Click the back arrow to return to the settings and again to return to the main app screen.

For instructions on how to run the demo, please refer to [this document](./docs/issuer-kit.md).

To restart the applications:

- In the second terminal, hit Ctrl-C and then:
  - run `./manage stop` to stop the apps so you can update the code and restart by rerunning the `./manage` commands above. 

- To stop and delete the storage for the apps:
  - In the second terminal, hit Ctrl-C and run `./manage down`
  - In the first terminal, hit Ctrl-C to stop `ngrok`

### Local Mode

In Local Mode the entire application runs locally and uses a locally deployed Indy ledger. In Local Mode you cannot use the Streetcred agent because it is unable to access the ledger being used.

To run in local mode, open two shell/terminal sessions:

1. Follow the [instructions](https://github.com/bcgov/von-network#running-the-network-locally) to start `von-network` running locally
2. Change to the Issuer Kit [docker](./docker) folder:
   - run `./manage build` to assemble the runtime images for the services.
   - run `./manage start` to start the containers

Once started, the services will be exposed on localhost at the following endpoints:

- `api`: http://localhost:5000

- `issuer-admin` Administrator app: http://localhost:8081

- `issuer-web` Issuer app: http://localhost:8082

- `db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `agent`: http://localhost:8024

- `maildev`: http://localhost:8050

:information_source: When running in local OR demo mode, changes to the code will not be reflected in the containers unless a rebuild using `./manage build` and restart using `./manage start` is performed.

To restart the applications:

- In the second terminal, hit Ctrl-C and then:
  - run `./manage stop` to stop the apps so you can update the code and restart by rerunning the `./manage` commands above. 

- To stop and delete the storage for the apps:
  - In the second terminal, hit Ctrl-C and run `./manage down`
  - In the first terminal, hit Ctrl-C to stop `ngrok`

### Development Mode

Development mode runs the admin frontend, public frontend and the api/controller in development mode with hot-reloading enabled. This means that any change to the code in the `src` directories of `issuer-admin`, `issuer-web` and `api` will automatically trigger a rebuild and reload of the associated service.

To run in development mode, run `npm install` in each one of the `issuer-admin`, `issuer-web` and `api` directories and then run the same steps as `Local Mode` above, but use `./manage start-dev` in place of the `./manage start` command in the second shell.

The services will be running at the following endpoints:

- `api`: http://localhost:5000

- `issuer-admin` Administrator app: http://localhost:4250

- `issuer-web` Issuer app: http://localhost:4251

- `db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `agent`: http://localhost:8024

- `maildev`: http://localhost:8050

## Keycloak Configuration and Users

While it is possible to provide a client id and token pair to use the GitHub integration for Keycloak (follow the on-screen instructions when starting the apps), two default users  are shipped with the default Keycloak configuration:

- to access the `issuer-admin` Administrator app, use the following username/password combination: `issuer-admin/issuer-admin`.

- to access the `issuer-web` Issuer webapp, use the following username/password combination: `user/user`.

:warning: The `issuer-admin` user can also access the public webapp, however `issuer-web` will only be able to access the public site. When testing locally, it is recommended to open admin and public sites in two different browsers in order to prevent cookies to auto-login the admin user onto the public site.

## Credential Schema

Each api/controller can issue several credentials matching different schemas: the schema definitions that can be processed by the api/controller are described in [this file](api/config/schemas.json). There are two ways of defining a schema: using the `id` of the schema on the target ledger or, alternatively, defining the `schema_name`, `schema_version` and `attributes` for the schema. Additionally, ***one schema in the provided list must be marked with the `default: true` property***: this describes which schema will be used if no explicit request is forwarded to the api/controller.

When using Issuer Kit in demo mode the api/controller will use the schema marked as default, which corresponds to the schema definition that was published to the BCovrin Test Ledger by the BCGov issuer, and issue credentials that match that definition. In most cases updating the schema definition should not be necessary, however if this was the case the following steps will be required to instruct the controller/agent to publish a new schema definition on the target ledger, and use it:

- update the schema definition(s) in [schemas.json](api/config/schemas.json) using the desired fields.

- update the configuration of the public-facing web application to support the new fields and request the new schema. The public web application is contained in the [issuer-web](./issuer-web) folder and the files to update are `claim-config.json` for the form definition and `config.json` to add (or update) the following section:
```
"credentials": {
    "schema_id": "85459GxjNySJ8HwTTQ4vq7:2:verified_person:1.4.0"
  }
```

:information_source: If you are planning on using Issuer Kit in your own production-like environment - regardless of wether you will be re-using the BCGov schema or creating your own - you may want to update the `AGENT_WALLET_SEED` environment variable with a unique value used only by your agent/organization rather than using the default value used for demo purposes.

## App Configuration

The api, administrator and issuer applications can be configured by using a number of environment variables and settings stored in configuration files. The application is shipped with default configurations that work well when running in the provided dockerized environment, if settings need to be updated look for:

  - `api`: all the settings are defined in the [config/default.json](api/config/default.json) file. The API is a NodeJS application built on [FeathersJS](https://docs.feathersjs.com/api/configuration.html#configuration-directory). Rather than defining multiple files for each environment, the default configuration has been extended to use environment variables that can be inected at runtime. Take a look at the relevant sections in [docker/manage](./docker/manage) and [docker/docker-compose.yml](docker/docker-compose.yml) to learn what is being injected into the api container. Additionally, the body of the email sent out as invite can be customized by updating the [api/config/invite-email.html](invite-email.html) file.

  - `issuer-admin` and `issuer-web` are configured using the configuration files in the respective `public/config` folders. Overriding the file shipped with the application with your custom settings file at deployment time will cause the web application to pick up the settings.

### SMTP Settings

The api/controller uses [nodemailer](https://nodemailer.com) to send email invitations. When running on localhost a `maildev` service is used to intercept outgoing email messages.

If you are running a deployment and require emails to be sent, set the following environment variables appropriately:

  - *SMTP_HOST*: your SMTP server host.

  - *SMTP_PORT*: the port used by your SMTP server.

  - *SMTP_USERNAME*: the username to authenticate with SMTP server.

  - *SMTP_PASS*: the password to authenticate with the SMTP server.
  
  - *ADMIN_EMAIL*: the email address that will be used as sender of your emails.

### API Docs

The `api` service exposes a Swagger documentation page at `http://localhost:5000/swagger/docs`.
Publicly available APIs are documented there.

:information_source: at the time of writing, the response structure of the `/connection` POST method to request a new connection invitation is not accurate. The API docs represent the response the same as for the GET method, however in this case the response represent a new Aries connection invitation that matches the AriesConnection data model in [this file](api/src/models/connection.ts).

### Customizing the services

The configuration settings for the services in Issuer Kit can be found [here](docs/ConfiguringIssuerKit.md).
