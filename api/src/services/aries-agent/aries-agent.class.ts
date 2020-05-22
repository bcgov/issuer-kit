import { Params } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { loadJSON } from "../../utils/load-config-file";


interface RawSchemaDefinition {
  schema_name: string;
  schema_version: string;
  attributes: string[];
}

interface PublishedSchemaDefinition {
  id: string;
}

interface Data {}

interface ServiceOptions {
  schemas?: Map<string, RawSchemaDefinition>;
}

export class AriesAgent {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;

    const supportedSchemas = new Map<string, RawSchemaDefinition>();

    const config = loadJSON("schemas.json") as (
      | RawSchemaDefinition
      | PublishedSchemaDefinition
    )[];
    config.forEach(
      (schema: RawSchemaDefinition | PublishedSchemaDefinition) => {
        if ("id" in schema) {
          // Already published to ledger,add to supported array
          // TODO: get schema def from ledger
          supportedSchemas.set(schema.id, {} as RawSchemaDefinition);
        } else {
          // Need to check wether the schema was registered, or register it
          // TODO: register schema on ledger
          const newId = "";
          supportedSchemas.set(newId, schema);
        }
      }
    );

    this.options.schemas = supportedSchemas;
  }

  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }
}
