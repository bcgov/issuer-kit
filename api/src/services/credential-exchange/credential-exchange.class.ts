import { Id, Params } from "@feathersjs/feathers";
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from "feathers-swagger/types";
import { Application } from "../../declarations";
import { Claim } from "../../models/credential";
import {
  AriesCredentialAttribute,
  AriesCredentialOffer,
  CredExServiceResponse,
} from "../../models/credential-exchange";
import { ServiceAction, ServiceType } from "../../models/enums";
import { formatCredentialOffer } from "../../utils/credential-exchange";
import { updateInviteRecord } from "../../utils/issuer-invite";
import { AriesSchema } from "../../models/schema";
import logger from "../../logger";

interface Data {
  token?: string;
  schema_id: string;
  connection_id: string;
  claims: Claim[];
}

interface ServiceOptions {}

export class CredentialExchange implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async get(id: Id, params?: Params): Promise<CredExServiceResponse> {
    return await this.app.service("aries-agent").create({
      service: ServiceType.CredEx,
      action: ServiceAction.Fetch,
      data: { credential_exchange_id: id },
    });
  }

  async create(data: Data, params?: Params): Promise<CredExServiceResponse> {
    const comment = this.app.get("issuer").offerComment;
    const attributes = data.claims.map(
      (claim: any) =>
        ({
          name: claim.name,
          value: claim.value,
          "mime-type": "text/plain",
        } as AriesCredentialAttribute)
    );

    let schema_id = data.schema_id;
    if (!schema_id) {
      const default_schema = this.app
        .get("schemas")
        .get("default") as AriesSchema;
      if (!default_schema) {
        throw new Error(
          "No schema id was provided and no default schema is available"
        );
      }
      schema_id = default_schema.schema_id || default_schema.schema.id;
    }
    const cred_def_id = this.app.get("credDefs").get(schema_id) as string;

    const credentialOffer = formatCredentialOffer(
      data.connection_id,
      comment,
      attributes,
      cred_def_id
    ) as AriesCredentialOffer;

    const newCredEx = (await this.app.service("aries-agent").create({
      service: ServiceType.CredEx,
      action: ServiceAction.Create,
      data: credentialOffer,
    })) as CredExServiceResponse;

    if (data.token) {
      updateInviteRecord(
        { token: data.token },
        { credential_exchange_id: newCredEx.credential_exchange_id },
        this.app
      );
    }
    return newCredEx;
  }

  docs: ServiceSwaggerOptions = {
    description: "Credential Exchange",
    idType: "string",
  };

  model = {
    title: "Credential Exchange",
    description: "Credential Exchange Model",
    type: "object",
    required: [],
    properties: {
      id: {
        type: "string",
        description: "The credential exchange uuid",
        readOnly: true,
      },
      state: {
        type: "string",
        description: "The credential exchange state",
        readOnly: true,
      },
      connection_id: {
        type: "string",
        description:
          "The uuid for the connection used during the credential exchange",
      },
      claims: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "The uuid for the connection used during the credential exchange",
      },
    },
  };
}
