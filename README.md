# BC Gov Identity Kit

This repo contains code and deployment instructions for running the BC Gov's Identity Kit Verifiable Credentials proof of concept (PoC). The ID Kit PoC includes:

- An administrator application that allows the organization operating the PoC to invite (via email) and track participants to be issued a verifiable credential.
- An issuer application used by participants to set the claims in, and be issued, a verifiable credential.
- Links to applications at which the verifiable credential can be used for login using a [verifiable credential-enabled OpenID Connect Identity Provider](https://github.com/bcgov/vc-authn-oidc) (IdP).

The instructions below allow you to run the application on your laptop in a couple of different ways. Once you are familiar with the app, you can configure the code to be deployed on enterprise hardware, with updates applicable to your environment.

An overview of the architecture of the IdKit and the administrator and participant flows can be found [here](docs/identity-kit-poc.md).

Need a mobile app to try? Instructions are available [here](../identity-kit-poc/docs/GettingApp.md) for getting an IOS mobile app. An Android app will be available Real Soon Now.

> The instructions here are still a bit raw. We're iterating on them and check back if things don't go smoothly. We're happy to answer any questions you have. Easiest way to connect with us is to add an [issue](https://github.com/bcgov/identity-kit-poc/issues) in this repo.

## Pre-Requisites

- [Docker](https://www.docker.com/products/docker-desktop)

- [s2i](https://github.com/openshift/source-to-image/releases)

- [jq](https://stedolan.github.io/jq)

- [ngrok](https://ngrok.com)

- [von-network](https://github.com/bcgov/von-network) - Local Mode only (see below)

`jq` and `ngrok` are available on package manager systems for different platforms such as [Homebrew](https://brew.sh/) (Mac), [Chocolatey](https://chocolatey.org/) (Windows) and various Linux distribution package managers.

## Running the Identity Kit

Identity Kit can be started in different (demo, local and developer) modes by executing the steps in the respective sections below. The following are a couple important things to keep in mind as you start the apps:

- When starting the system, there is an initial pause with a message to give you a chance to setup some GitHub integration capabilities. That is needed only if you want test out logging into the admin and issuer applications using GitHub credentials. When getting started, we recommend that you just wait for the start up process to continue.

- Assuming you don't have a email server handy, you will get an error when adding a participant, and they won't get your email. To access the issuer, click the `<- Identity` button (top left) to get back to the participants list, click on the newly added user, and use the URL at the top of the screen. The URL includes the server for the Issuer app, and the GUID for the just created user. That's the URL that the participant would have received in the email they didn't get.
  - If you do have an email server handy, configuration parameters can be set in environment variables that are processed in the `./manage` script.

- The apps (administrator and issuer) are protected by a locally running instance of Red Hat's Keycloak Identity and Access Management (IAM) component that is started as part of the Docker compose process. Credentials are pre-configured for the two applications with appropriate access as follows:
  - For the administrator app use: `issuer-admin`/`issuer-admin`
  - For the issuer app use: `user`/`user`

### Demo Mode

Demo mode runs Identity Kit using the [BCovrin Test](http://test.bcovrin.vonx.io) ledger and uses `ngrok` to expose the agent running locally to the Internet. The Streetcred mobile agent (iOS and Android) can be used with Identity Kit if you use demo mode.

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

For instructions on how to run the demo, please refer to [this document](./docs/identity-kit-poc.md).

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
2. Change to the Identity Kit [docker](./docker) folder:
   - run `./manage build` to assemble the runtime images for the services.
   - run `./manage start` to start the containers

Once started, the services will be exposed on localhost at the following endpoints:

- `api`: http://localhost:5000

- `issuer-admin` Administrator app: http://localhost:8081

- `issuer-web` Issuer app: http://localhost:8082

- `db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `agent`: http://localhost:8024

:information_source: When running in local OR demo mode, changes to the code will not be reflected in the containers unless a rebuild using `./manage build` and restart using `./manage start` is performed.

To restart the applications:

- In the second terminal, hit Ctrl-C and then:
  - run `./manage stop` to stop the apps so you can update the code and restart by rerunning the `./manage` commands above. 

- To stop and delete the storage for the apps:
  - In the second terminal, hit Ctrl-C and run `./manage down`
  - In the first terminal, hit Ctrl-C to stop `ngrok`

### Development Mode

Development mode runs the admin frontend, public frontend and the controller in development mode with hot-reloading enabled. This means that any change to the code in the `src` directories of `issuer-admin`, `issuer-web` and `api` will automatically trigger a rebuild and reload of the associated service.

To run in development mode, run `npm install` in each one of the `issuer-admin`, `issuer-web` and `api` directories and then run the same steps as `Local Mode` above, but use `./manage start-dev` in place of the `./manage start` command in the second shell.

The services will be running at the following endpoints:

- `api`: http://localhost:5000

- `issuer-admin` Administrator app: http://localhost:4250

- `issuer-web` Issuer app: http://localhost:4251

- `db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `agent`: http://localhost:8024

## Keycloak Configuration and Users

While it is possible to provide a client id and token pair to use the GitHub integration for Keycloak (follow the on-screen instructions when starting the apps), two default users  are shipped with the default Keycloak configuration:

- to access the `issuer-admin` Administrator app, use the following username/password combination: `issuer-admin/issuer-admin`.

- to access the `issuer-web` Issuer webapp, use the following username/password combination: `user/user`.

:warning: The `issuer-admin` user can also access the public webapp, however `issuer-web` will only be able to access the public site. When testing locally, it is recommended to open admin and public sites in two different browsers in order to prevent cookies to auto-login the admin user onto the public site.

## Credential Schema

The schema of the credential that will be issued by Identity Kit is defined in [this file](api/src/app/admin/issues/schema.ts)

When using Identity Kit in demo mode the controller will instruct the agent to use the schema definition that was published to the BCovrin Test Ledger by the BCGov issuer, and therefore issue credentials that match that definition. In most cases updating the schema definition should not be necessary, however if this was the case the following steps will be required to instruct the controller/agent to publish a new schema definition on the target ledger, and use it:

- update the schema attributes in [schema.ts](api/src/app/admin/issues/schema.ts) with the desired fields.

- update the form in the public-facing web application to support the new fields. The public web application is contained in the [issuer-web](./issuer-web) folder.

- unset the `EXISTING_SCHEMA_ID` environment variable from the `api` deployment/container. This will tell it to generate a new schema definition associated with the current DID.

:information_source: If you are planning on using Identity Kit in your own production-like environment - regardless of wether you will be re-using the BCGov schema or creating your own - you may want to update the `AGENT_WALLET_SEED` environment variable with a unique value used only by your agent/organization rather than using the default value used for demo purposes.

## App Configuration

The identity-kit  controller, administrator and issuer applications can be configured by using a number of environment variables and settings stored in configuration files. The application is shipped with default configurations that work well when running in the provided dockerized environment, if settings need to be updated look for:

  - `controller`: all the settings are injected via environment variables, take a look at the relevant sections in [docker/manage](./docker/manage) and [docker/docker-compose.yml](docker/docker-compose.yml). Some extra details are provided below for settings specific to NodeMailer.

  - `issuer-admin` Administrator app: the application is configured using [issuer-admin/src/assets/config/config.json](issuer-admin/src/assets/config/config.json). Overriding the file shipped with the application with your custom settings file at deployment time will cause the web application to pick up the settings.

  - `issuer-web` Issuer app: similarly to the Administrator app, the configuration is stored in [issuer-web/src/assets/config/config.json](issuer-web/src/assets/config/config.json) and can be overridden at deployment time.

### SMTP Settings

The controller uses [nodemailer](https://nodemailer.com) to send email invitations. When running in localhost the default behaviour is to not send emails and show an alert with the invite link instead.

If you are running a deployment and require emails to be sent, set the following environment variables appropriately:

  - *SMTP_HOST*: your SMTP server host.

  - *SMTP_PORT*: the port used by your SMTP server.

  - *SMTP_USERNAME*: the username to authenticate with SMTP server.

  - *SMTP_PASS*: the password to authenticate with the SMTP server.
  
  - *ADMIN_EMAIL*: the email address that will be used as sender of your emails.

If additional tweaks are required, the code responsible for email delivery is in [email.service.ts](api/src/app/services/email.service.ts).
