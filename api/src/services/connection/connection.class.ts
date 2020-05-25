import { Id, Params } from "@feathersjs/feathers";
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from "feathers-swagger/types";
import { Application } from "../../declarations";
import {
  ConnectionServiceResponse,
  AriesInvitation,
} from "../../models/connection";
import { ServiceAction, ServiceType } from "../../models/enums";

interface Data {}

interface ServiceOptions {}

export class Connection implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async get(id: Id, params?: Params): Promise<ConnectionServiceResponse> {
    return await this.app.service("aries-agent").create({
      service: ServiceType.Connection,
      action: ServiceAction.Fetch,
      data: { connection_id: id },
    });
  }

  async create(data: Data, params?: Params): Promise<AriesInvitation> {
    return (await this.app.service("aries-agent").create({
      service: ServiceType.Connection,
      action: ServiceAction.Create,
      data: {},
    })) as AriesInvitation;
  }

  docs: ServiceSwaggerOptions = {
    description: "Connection",
    idType: "string",
  };

  model = {
    title: "Connection",
    description: "Connection Model",
    type: "object",
    required: [],
    properties: {
      id: {
        type: "string",
        description: "The connection uuid",
        readOnly: true,
      },
      state: {
        type: "string",
        description: "The connection state",
        readOnly: true,
      },
    },
  };
}
