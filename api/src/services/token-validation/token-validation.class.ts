import { Id, Params } from "@feathersjs/feathers";
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from "feathers-swagger/types";
import { Application } from "../../declarations";
import { TokenValidationResponse } from "../../models/token";
import { isValidInvite } from "../../utils/issuer-invite";

interface Data {}

interface ServiceOptions {}

export class TokenValidation implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async create(data: Data, params?: Params): Promise<TokenValidationResponse> {
    const token = params?.route?.token || "";
    return isValidInvite(token, this.app);
  }

  docs: ServiceSwaggerOptions = {
    description: "Invite Token Validation",
    idType: "string",
  };

  model = {
    title: "Invite Token Validation",
    description: "Issuer Invite Validation Model",
    type: "object",
    required: [],
    properties: {
      token: {
        type: "string",
        description: "The unique invite token",
        readOnly: true,
      },
      issued: {
        type: "boolean",
        description:
          "The flag indicating wether the credential has been issued",
        readOnly: true,
      },
      expired: {
        type: "boolean",
        description: "The flag indicating wether the invite has expired",
        readOnly: true,
      },
      data: {
        type: "object",
        description: "A free-form object containing additional invite data",
        readOnly: true,
      },
    },
  };
}
