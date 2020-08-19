import { NotImplemented } from "@feathersjs/errors";
import { Params } from "@feathersjs/feathers";
import Axios, { AxiosRequestConfig } from "axios";
import { Application } from "../../declarations";
import {
  AriesConnection,
  AriesInvitation,
  ConnectionServiceResponse,
} from "../../models/connection";
import { CredDefServiceResponse } from "../../models/credential-definition";
import {
  AriesCredentialExchange,
  AriesCredentialOffer,
  CredExServiceResponse,
  AriesCredentialAttribute,
} from "../../models/credential-exchange";
import { ServiceAction, ServiceType } from "../../models/enums";
import { AriesSchema, SchemaDefinition } from "../../models/schema";
import { CredDefUtils } from "../../utils/credential-definition";
import { loadJSON } from "../../utils/load-config-file";
import { formatCredentialPreview } from "../../utils/credential-exchange";
import { AcaPyUtils } from "../../utils/aca-py";
import logger from "../../logger";

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
  acaPyUtils: AcaPyUtils;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
    this.acaPyUtils = AcaPyUtils.getInstance(app);
    this.init();
  }

  private async init() {
    await this.acaPyUtils.init();
    logger.info("Aries Agent service initialized");
  }

  async create(data: Data, params?: Params): Promise<any> {
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
        } else if (data.action === ServiceAction.Fetch) {
          return this.getCredentialExchange(data.data.credential_exchange_id);
        } else if (data.action === ServiceAction.Issue) {
          return this.issueCredential(
            data.data.credential_exchange_id,
            data.data.attributes
          );
        }
      default:
        return new NotImplemented(
          `The operation ${data.service}/${data.action} is not supported`
        );
    }
  }

  private async newConnection(): Promise<AriesInvitation> {
    const url = `${this.acaPyUtils.getAdminUrl()}/connections/create-invitation`;
    const response = await Axios.post(
      url,
      {},
      this.acaPyUtils.getRequestConfig()
    );
    return response.data as AriesInvitation;
  }

  private async getConnection(id: string): Promise<ConnectionServiceResponse> {
    const url = `${this.acaPyUtils.getAdminUrl()}/connections/${id}`;
    const response = await Axios.get(url, this.acaPyUtils.getRequestConfig());
    const data = response.data as AriesConnection;
    return {
      connection_id: data.connection_id,
      state: data.state,
    } as ConnectionServiceResponse;
  }

  private async newCredentialExchange(
    data: AriesCredentialOffer
  ): Promise<any> {
    const url = `${this.acaPyUtils.getAdminUrl()}/issue-credential/send-offer`;
    const response = await Axios.post(
      url,
      data,
      this.acaPyUtils.getRequestConfig()
    );
    const credExData = response.data as AriesCredentialExchange;
    return {
      credential_exchange_id: credExData.credential_exchange_id,
      state: credExData.state,
    } as CredExServiceResponse;
  }

  private async getCredentialExchange(
    id: string
  ): Promise<CredExServiceResponse> {
    const url = `${this.acaPyUtils.getAdminUrl()}/issue-credential/records/${id}`;
    const response = await Axios.get(url, this.acaPyUtils.getRequestConfig());
    const credExData = response.data as AriesCredentialExchange;
    return {
      credential_exchange_id: credExData.credential_exchange_id,
      state: credExData.state,
    } as CredExServiceResponse;
  }

  private async issueCredential(
    id: string,
    attributes: AriesCredentialAttribute[]
  ): Promise<CredExServiceResponse> {
    const url = `${this.acaPyUtils.getAdminUrl()}/issue-credential/records/${id}/issue`;
    const response = await Axios.post(
      url,
      { credential_preview: formatCredentialPreview(attributes) },
      this.acaPyUtils.getRequestConfig()
    );
    const credExData = response.data as AriesCredentialExchange;
    return {
      credential_exchange_id: credExData.credential_exchange_id,
      state: credExData.state,
    } as CredExServiceResponse;
  }
}
