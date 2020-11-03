import { Application } from "@feathersjs/express";
import Axios from "axios";
import logger from "../logger";
import { UndefinedAppError } from "../models/errors";
import { AriesSchema, SchemaDefinition } from "../models/schema";
import { AcaPyUtils } from "./aca-py";

export class SchemaUtils {
  private static instance: SchemaUtils;
  app: Application;
  utils: AcaPyUtils;

  private constructor(app: Application) {
    this.app = app;
    this.app.set("schemas", new Map<string, AriesSchema>());
    this.app.set("public-schemas", new Map<string, AriesSchema>());
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

  private storeSchema(
    schema: AriesSchema,
    isDefault = false,
    isPublic = false
  ) {
    this.app.get("schemas").set(schema.schema_id || schema.schema.id, schema);

    if (isDefault) {
      // Set default schema used by issuer
      this.app.get("schemas").set("default", schema);
      logger.debug(`Schema ${JSON.stringify(schema)} stored as [default] `);
    }
    if (isPublic) {
      // Add schema to list of schemas that can be used without authentication
      this.app
        .get("public-schemas")
        .set(schema.schema_id || schema.schema.id, schema);
      logger.debug(`Schema ${JSON.stringify(schema)} stored as [public] `);
    }
    if (isDefault && isPublic) {
      this.app.get("public-schemas").set("default", schema);
    }
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
    this.storeSchema(schemaResponse, schema.default, schema.public);
    return Promise.resolve(schemaResponse);
  }

  async fetchSchema(
    id: string,
    isDefault = false,
    isPublic = false
  ): Promise<AriesSchema> {
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
    this.storeSchema(schemaResponse, isDefault, isPublic);

    return Promise.resolve(schemaResponse);
  }
}
