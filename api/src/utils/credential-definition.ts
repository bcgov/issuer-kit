import {
  AriesCredentialDefinition,
  CredDefServiceResponse,
} from "../models/credential-definition";
import { Application } from "@feathersjs/express";
import { AcaPyUtils } from "./aca-py";
import { UndefinedAppError } from "../models/errors";
import Axios from "axios";
import logger from "../logger";

export class CredDefUtils {
  private static instance: CredDefUtils;
  app: Application;
  utils: AcaPyUtils;

  private constructor(app: Application) {
    this.app = app;
    this.app.set("credDefs", new Map<string, string>());
    this.utils = AcaPyUtils.getInstance(app);
  }

  static getInstance(app?: Application): CredDefUtils {
    if (!CredDefUtils.instance) {
      if (!app) {
        throw new UndefinedAppError(
          "Error creating a new instance of [CredDefUtils]: no app was provided"
        );
      }
      CredDefUtils.instance = new CredDefUtils(app);
      logger.debug("Created new instance of [CredDefUtils]");
    }
    return CredDefUtils.instance;
  }

  formatCredentialDefinition(
    schema_id: string,
    support_revocation = false,
    tag = "default"
  ): AriesCredentialDefinition {
    return {
      schema_id: schema_id,
      support_revocation: support_revocation,
      tag: tag,
    };
  }

  async getOrCreateCredDef(
    credDef: AriesCredentialDefinition
  ): Promise<CredDefServiceResponse> {
    let credDefResponse: CredDefServiceResponse;
    if (this.app.get("credDefs").get(credDef.schema_id)) {
      logger.debug(
        `Credential definition already in cache: ${JSON.stringify(credDef)}`
      );
      credDefResponse = {
        credential_definition_id:
          this.app.get("credDefs").get(credDef.schema_id) || "",
      };
    } else {
      // Search for credential definition on ledger first, otherwise publish
      logger.debug(
        `Searching for credential definition on ledger: ${JSON.stringify(credDef)}`
      );
      const url = `${this.utils.getAdminUrl()}/credential-definitions/created`;
      let config = this.utils.getRequestConfig()
      config["params"] = { schema_id: credDef.schema_id }

      const response = await Axios.get(url, config)
      const credDefIDs = response.data.credential_definition_ids as string[]

      if (credDefIDs.length > 0) {
        credDefResponse = {
          credential_definition_id: credDefIDs[credDefIDs.length - 1]
        }
        logger.debug(
          `Credential definition found on ledger: ${JSON.stringify(credDef)}`
        );
      } else {
        logger.debug(
          `Publishing credential definition to ledger: ${JSON.stringify(credDef)}`
        );
        const url = `${this.utils.getAdminUrl()}/credential-definitions`;
        const response = await Axios.post(
          url,
          credDef,
          this.utils.getRequestConfig()
        );
        credDefResponse = response.data as CredDefServiceResponse;
        logger.debug(
          `Published credential definition: ${JSON.stringify(credDefResponse)}`
        );
      }

    }
    return credDefResponse;
  }
}
