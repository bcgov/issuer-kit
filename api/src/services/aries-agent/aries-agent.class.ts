import { Params } from "@feathersjs/feathers";
import Axios, { AxiosRequestConfig } from "axios";
import { Application } from "../../declarations";
import {
  AriesConnection,
  AriesInvitation,
  ConnectionServiceResponse,
} from "../../models/connection";
import {
  AriesCredentialExchange,
  AriesCredentialOffer,
  CredExServiceResponse,
} from "../../models/credential-exchange";
import { ServiceAction, ServiceType } from "../../models/enums";
import { AriesSchema, SchemaDefinition } from "../../models/schema";
import { loadJSON } from "../../utils/load-config-file";
import { CredDefServiceResponse } from "../../models/credential-definition";
import { formatCredentialDefinition } from "../../utils/credential-definition";

interface AgentSettings {
  adminUrl: string;
  adminApiKey: string;
}

interface Data {
  service: ServiceType;
  action: ServiceAction;
  data: any;
}

interface ServiceOptions {}

export class AriesAgent {
  app: Application;
  options: ServiceOptions;

  agent: AgentSettings;
  schemas: Map<string, AriesSchema>;
  credDefs: Map<string, string>;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;

    const agentSettings = app.get("agent") as AgentSettings;
    this.agent = agentSettings;

    this.schemas = new Map<string, AriesSchema>();
    this.credDefs = new Map<string, string>();
  }

  async create(data: Data, params?: Params): Promise<any> {
    if (this.schemas.size === 0) {
      // lazy-load configured schemas on first run
      await this.initSchemas();
    }

    switch (data.service) {
      case ServiceType.Connection:
        if (data.action === ServiceAction.Create) {
          return this.newConnection();
        } else {
          return this.getConnection(data.data.connection_id);
        }
      case ServiceType.CredEx:
        if (data.action === ServiceAction.Create) {
          return this.newCredentialExchange(data.data as AriesCredentialOffer);
        } else {
          return this.getCredentialExchange(data.data.credential_exchange_id);
        }
      case ServiceType.CredDef:
        return this.getOrCreateCredDef(data.data.schema_id);
      default:
        return { status: "Unsupported operation" };
    }
  }

  private getRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        "x-api-key": this.agent.adminApiKey,
      },
    } as AxiosRequestConfig;
  }

  private async initSchemas() {
    const config = loadJSON("schemas.json") as SchemaDefinition[];
    config.forEach(async (schemaDef: SchemaDefinition) => {
      let schema: AriesSchema;
      if (schemaDef.id) {
        // Already published to ledger, add to supported array
        schema = await this.getSchema(schemaDef.id);
      } else {
        // Check wether the schema was registered
        schema = await this.publishSchema(schemaDef);
      }
      this.schemas.set(schema.schema_id || schema.schema.id, schema);
    });
  }

  private async newConnection(): Promise<AriesInvitation> {
    const url = `${this.agent.adminUrl}/connections/create-invitation`;
    const response = await Axios.post(url, {}, this.getRequestConfig());
    return response.data as AriesInvitation;
  }

  private async getConnection(id: string): Promise<ConnectionServiceResponse> {
    const url = `${this.agent.adminUrl}/connections/${id}`;
    const response = await Axios.get(url, this.getRequestConfig());
    const data = response.data as AriesConnection;
    return {
      id: data.connection_id,
      state: data.state,
    } as ConnectionServiceResponse;
  }

  private async newCredentialExchange(
    data: AriesCredentialOffer
  ): Promise<any> {
    const url = `${this.agent.adminUrl}/issue-credential/send-offer`;
    const response = await Axios.post(url, data, this.getRequestConfig());
    const credExData = response.data as AriesCredentialExchange;
    return {
      id: credExData.credential_exchange_id,
      state: credExData.state,
    } as CredExServiceResponse;
  }

  private async getCredentialExchange(
    id: string
  ): Promise<CredExServiceResponse> {
    const url = `${this.agent.adminUrl}/issue-credential/records/${id}`;
    const response = await Axios.get(url, this.getRequestConfig());
    const credExData = response.data as AriesCredentialExchange;
    return {
      id: credExData.credential_exchange_id,
      state: credExData.state,
    } as CredExServiceResponse;
  }

  private async publishSchema(schema: SchemaDefinition): Promise<AriesSchema> {
    const url = `${this.agent.adminUrl}/schemas`;
    const response = await Axios.post(url, schema, this.getRequestConfig());
    return response.data as AriesSchema;
  }

  private async getSchema(id: string): Promise<AriesSchema> {
    const url = `${this.agent.adminUrl}/schemas/${id}`;
    const response = await Axios.get(url, this.getRequestConfig());
    return response.data as AriesSchema;
  }

  private async getOrCreateCredDef(
    schema_id: string
  ): Promise<CredDefServiceResponse> {
    let credExResponse: CredDefServiceResponse;
    if (this.credDefs.get(schema_id)) {
      credExResponse = {
        credential_definition_id: this.credDefs.get(schema_id) || "",
      };
    } else {
      const url = `${this.agent.adminUrl}/credential-definitions`;
      const credDef = formatCredentialDefinition(schema_id);
      const response = await Axios.post(url, credDef, this.getRequestConfig());
      credExResponse = response.data as CredDefServiceResponse;
      this.credDefs.set(schema_id, credExResponse.credential_definition_id);
    }
    return credExResponse;
  }
}
