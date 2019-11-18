# identity-kit-poc

Verifiable Credential Identity Starter Kit

## Pre-Requisites

To run the Identity Kit you will need a running [von-network](https://github.com/von-network).

## Running the Identity Kit

Run `./manage start` from the [docker](./docker) directory. This will start all the services required for the Identity Kit to run.

_Note:_ `wa-admin`, `wa-public` and `identity-controller` will start in development mode, so any change made to the source code of these apps will trigger a reload of the service.

The services will be running at the following endpoints:

- `identity-controller`: http://localhost:5000

- `wa-admin`: http://localhost:4250

- `wa-public`: http://localhost:4251

- `wa-db`: http://localhost:27017

- `keycloak`: http://localhost:8180

- `identity-kit-agent`: http://localhost:8024

## Keycloak Credentials

To support development, two users are made available in Keycloak:

- to access the `wa-admin` webapp, use the following username/password combination: `wa-admin/wa-admin`.

- to access the `wa-public` webapp, use the following username/password combination: `wa-user/wa-user`.
