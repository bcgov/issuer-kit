import { Db } from "mongodb";
import { Service, MongoDBServiceOptions } from "feathers-mongodb";
import { Application } from "../../declarations";
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from "feathers-swagger/types";

export class IssuerInvite extends Service implements ServiceSwaggerAddon {
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);

    const client: Promise<Db> = app.get("mongoClient");

    client.then((db) => {
      this.Model = db.collection("issuer-invite");
    });
  }

  docs: ServiceSwaggerOptions = {
    description: "Issuer Invite",
    idType: "string"
  };

  model = {
    title: "Issuer Invite",
    description: "Issuer Invite Model",
    type: "object",
    required: ["email"],
    properties: {
      token: {
        type: "string",
        description: "The unique invite token",
        readOnly: true,
      },
      email: {
        type: "string",
        description: "The email where the invite will be sent to",
      },
      issued: {
        type: "boolean",
        description:
          "The flag indicating wether the credential has been issued",
      },
      expired: {
        type: "boolean",
        description: "The flag indicating wether the invite has expired",
      },
      created_at: {
        $ref: "#/definitions/ISODateFormat",
      },
      created_by: {
        type: "string",
        description: "The userId who created the invite",
      },
      updated_at: {
        $ref: "#/definitions/ISODateFormat",
      },
      updated_by: {
        type: "string",
        description: "The userId who updated the invite",
      },
      data: {
        type: "object",
        description: "A free-form object containing additional invite data",
      },
    },
  };
}
