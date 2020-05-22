import { Id, Params } from "@feathersjs/feathers";
import {
  ServiceSwaggerAddon,
  ServiceSwaggerOptions,
} from "feathers-swagger/types";
import { Application } from "../../declarations";

interface Data {}

interface ServiceOptions {}

export class Connection implements ServiceSwaggerAddon {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async get(id: Id, params?: Params): Promise<Data> {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
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
