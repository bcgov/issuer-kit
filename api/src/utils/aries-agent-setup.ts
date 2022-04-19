import { Application } from "@feathersjs/express";
import logger from "../logger";
import { UndefinedAppError } from "../models/errors";
import { AriesSchema, SchemaDefinition } from "../models/schema";
import { CredDefUtils } from "./credential-definition";
import { loadJSON } from "./load-config-file";
import { SchemaUtils } from "./schema";
import { sleep } from "./sleep";
import { AcaPyUtils } from "./aca-py";

export class AriesAgentSetup {
  static instance: AriesAgentSetup;
  app: Application;
  utils: AcaPyUtils;

  private constructor(app: Application) {
    this.app = app;
    this.utils = AcaPyUtils.getInstance(app);
  }

  static getInstance(app?: Application): AriesAgentSetup {
    if (!this.instance) {
      if (!app) {
        throw new UndefinedAppError(
          "Error creating a new instance of [AriesAgentSetup]: no app was provided"
        );
      }
      this.instance = new AriesAgentSetup(app);
      logger.debug("Created new instance of [AriesAgentSetup]");
    }
    return this.instance;
  }

  async processDefinition(schemaDef: SchemaDefinition) {}

  async init(): Promise<any> {
    const config = loadJSON("schemas.json") as SchemaDefinition[];
    const schemas = new Map<string, AriesSchema>();
    const schemaUtils = SchemaUtils.getInstance(this.app);
    const credDefs = new Map<string, string>();
    const credDefUtils = CredDefUtils.getInstance(this.app);

    // wait for aca-py agent to be ready
    await this.utils.init();

    if (this.utils.isTractionBackend()) {
      // for traction, we need to create a default tenant and "activate" it
      // TODO
    }

    // init schemas and cred_defs
    for (let schemaDef of config) {
      try {
        logger.debug(
          `Initializing schema/cred_def: ${JSON.stringify(schemaDef)}`
        );
        let schema: AriesSchema;
        if (schemaDef.id) {
          // Already published to ledger
          schema = await schemaUtils.fetchSchema(
            schemaDef.id,
            schemaDef.default,
            schemaDef.public
          );
        } else {
          // Register to the ledger
          schema = await schemaUtils.publishSchema(schemaDef);
        }
        schemas.set(schema.schema_id || schema.schema.id, schema);
        if (schemaDef.default) {
          // Set default schema used by issuer
          schemas.set("default", schema);
        }

        const support_revocation = schemaDef.revocable || false;
        const tag = schemaDef.tag || "default";

        //  publish cred_def for current schema
        const formattedCredDef = credDefUtils.formatCredentialDefinition(
          schema.schema.id,
          support_revocation,
          tag
        );
        const credDef = await credDefUtils.getOrCreateCredDef(formattedCredDef);
        credDefs.set(schema.schema.id, credDef.credential_definition_id);
      } catch (err) {
        logger.error(err);
      }
    }

    if (!schemas.get("default")) {
      logger.warn(
        "No default schema set, all requests to the API will need to specify which schema to use"
      );
    }
    return Promise.resolve({
      schemas: schemas,
      credDefs: credDefs,
    });
  }
}
