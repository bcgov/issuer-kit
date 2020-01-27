# identity-kit-poc

Verifiable Credential Identity Starter Kit

## Pre-Requisites

- [Docker](https://www.docker.com/products/docker-desktop)

- [s2i](https://github.com/openshift/source-to-image/releases)

- [jq](https://stedolan.github.io/jq)

- [ngrok](https://ngrok.com)

For `jq` and `ngrok` the recommended approach to installing the required package(s) is to use either [Homebrew](https://brew.sh/) (MAC) or [Chocolatey](https://chocolatey.org/) (Windows).

**Please Note:**
When running Identity Kit fully locally (e.g.: in non-demo mode), a running instance of [von-network](https://github.com/bcgov/von-network) will also be required.

## Running the Identity Kit

Identity Kit can be started in different modes by executing the appropriate `./manage` command from within the [docker](./docker) folder.

### Demo Mode

The "demo mode" runs Identity Kit targeting the [BCovrin Test](http://test.bcovrin.vonx.io) ledger and uses `ngrok` to expose the agent running locally to the Internet.

To run in demo mode, open two shell/terminal sessions:

1. from within the [scripts](./scripts) folder execute `run-ngrok.sh`. This will create a tunnel for the agent.

2. from within the [docker](./docker) folder:
    - run `./manage build` to assemble the runtime images for the services
    - when the build completes, run `./manage start-demo`

Once started, the services will be exposed on localhost at the following endpoints:

- `identity-controller`: http://localhost:5000

- `wa-admin`: http://localhost:8081

- `wa-public`: http://localhost:8082

- `wa-db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `identity-kit-agent`: http://localhost:8024

For instructions on how to complete the demo, please refer to [this document](./docs/identity-kit-poc.md).


### Default Mode

This is similar to the above demo mode, but requires an instance of [von-network](https://github.com/bcgov/von-network) to be running locally to provide the ledger and does not use `ngrok` tunneling.

After following the instruction and starting `von-network`, open a shell/terminal session in the [docker](./docker) folder:

1. run `./manage build` to assemble the runtime images for the services.
2. run `./manage start` to start the containers

Once started, the services will be exposed on localhost at the following endpoints:

- `identity-controller`: http://localhost:5000

- `wa-admin`: http://localhost:8081

- `wa-public`: http://localhost:8082

- `wa-db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `identity-kit-agent`: http://localhost:8024

**Please Note:** when running in default OR demo mode, changes to the code will not be reflected in the containers unless a rebuild using `./manage build` and restart using `./manage start` is performed.


### Development Mode

Development mode runs the admin frontend, public frontend and the controller in development mode with hot-reloading enabled. This means that any change to the code in the `src` directories of `wa-admin`, `wa-public` and `identity-controller` will automatically trigger a rebuild and reload of the associated service.

To run in development mode:

1. open a shell/terminal session in the [docker](./docker) folder and run `./manage start-dev`

Run `./manage start` from the [docker](./docker) directory. This will start all the services required for the Identity Kit to run.

_Note:_ `wa-admin`, `wa-public` and `identity-controller` will start in development mode, so any change made to the source code of these apps will trigger a reload of the service.

The services will be running at the following endpoints:

- `identity-controller`: http://localhost:5000

- `wa-admin`: http://localhost:4250

- `wa-public`: http://localhost:4251

- `wa-db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `identity-kit-agent`: http://localhost:8024


## Keycloak Configuration and Users

While it is possible to provide a client id and token pair to use the GitHub integration for Keycloak (follow the on-screen instructions when starting the apps), two default users  are shipped with the default Keycloak configuration:

- to access the `wa-admin` administrative dashboard, use the following username/password combination: `wa-admin/wa-admin`.

- to access the `wa-public` webapp, use the following username/password combination: `wa-user/wa-user`.

:warning: The `wa-admin` user can also access the public webapp, however `wa-public` will only be able to access the public site. When testing locally, it is recommended to open admin and public sites in two different browsers in order to prevent cookies to auto-login the admin user onto the public site.

## Credential Schema

The schema of the credential that will be issued by Identity Kit is defined in [this file](.identity-controller/src/app/admin/issues/schema.ts)

When using Identity Kit in demo mode the controller will instruct the agent to use the schema definition that was published to the BCovrin Test Ledger by the BCGov issuer, and therefore issue credentials that match that definition. In most cases updating the schema definition should not be necessary, however if this was the case the following steps will be required to instruct the controller/agent to publish a new schema definition on the target ledger, and use it:

* update the schema attributes in [schema.ts](.identity-controller/src/app/admin/issues/schema.ts) with the desired fields.

* update the form in the public-facing web application to support the new fields. The public web application is contained in the [wa-public](./wa-public) folder.

* unset the `EXISTING_SCHEMA_ID` environment variable from the `identity-controller` deployment/container. This will tell it to generate a new schema definition associated with the current DID.


:information_source: If you are planning on using Identity Kit in your own production-like environment - regardless of wether you will be re-using the BCGov schema or creating your own - you may want to update the `AGENT_WALLET_SEED` environment variable with a unique value used only by your agent/organization rather than using the default value used for demo purposes.
