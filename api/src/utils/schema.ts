import Axios from "axios";
import logger from "../logger";
import { AriesSchema, SchemaDefinition } from "../models/schema";
import { AcaPyUtils } from "./aca-py";
import { Application } from "@feathersjs/express";
import { UndefinedAppError } from "../models/errors";

export class SchemaUtils {
  private static instance: SchemaUtils;
  app: Application;
  utils: AcaPyUtils;

  private constructor(app: Application) {
    this.app = app;
    this.app.set("schemas", new Map<string, AriesSchema>());
    this.utils = AcaPyUtils.getInstance(app);
  }

  static getInstance(app?: Application): SchemaUtils {
    if (!SchemaUtils.instance) {
      if (!app) {
        throw new UndefinedAppError(
          "Error creating a new instance of [SchemaUtils]: no app was provided"
        );
      }
      SchemaUtils.instance = new SchemaUtils(app);
      logger.debug("Created new instance of [SchemaUtils]");
    }
    return SchemaUtils.instance;
  }

  private addSchema(id: string, schema: AriesSchema) {
    this.app.get("schemas").set(id, schema);
  }

  async publishSchema(schema: SchemaDefinition): Promise<AriesSchema> {
    const url = `${this.utils.getAdminUrl()}/schemas`;
    logger.debug(`Publishing schema to ledger: ${JSON.stringify(schema)}`);
    const response = await Axios.post(
      url,
      schema,
      this.utils.getRequestConfig()
    );
    const schemaResponse = response.data as AriesSchema;
    logger.debug(`Published schema: ${JSON.stringify(schemaResponse)}`);
    this.addSchema(
      schemaResponse.schema_id || schemaResponse.schema.id,
      schemaResponse
    );
    if (schema.default) {
      // Set default schema used by issuer
      this.addSchema("default", schemaResponse);
    }
    return Promise.resolve(schemaResponse);
  }

  async fetchSchema(id: string, isDefault = false): Promise<AriesSchema> {
    const url = `${this.utils.getAdminUrl()}/schemas/${id}`;
    logger.debug(`Fetching schema with id ${id} from ledger.`);
    const response = await Axios.get(url, this.utils.getRequestConfig());
    const schemaResponse = response.data as AriesSchema;

    if (!schemaResponse.schema) {
      return Promise.reject(
        `Schema with id ${id} was not found on the ledger, the application will NOT be able to issue credentials for it`
      );
    }

    logger.debug(`Fetched schema: ${JSON.stringify(schemaResponse)}`);
    this.addSchema(schemaResponse.schema.id, schemaResponse);
    if (isDefault) {
      // Set default schema used by issuer
      this.addSchema("default", schemaResponse);
    }

    return Promise.resolve(schemaResponse);
  }
}
