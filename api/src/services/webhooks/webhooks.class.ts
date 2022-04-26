import { NotImplemented } from "@feathersjs/errors";
import { Params } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import {
  CredExState,
  WebhookTopic,
  ServiceType,
  ServiceAction,
} from "../../models/enums";
import logger from "../../logger";
import { updateInviteRecord } from "../../utils/issuer-invite";
import { AriesCredentialAttribute } from "../../models/credential-exchange";

interface Data {
  state?: CredExState;
  credential_exchange_id?: string;
  credential_proposal_dict?: any;
  revocation_id?: string;
  revoc_reg_id?: string;
}

interface TractionData {
  topic?: string;
  payload: Data;
}

interface ServiceOptions {}

export class Webhooks {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async create(data: Data, params?: Params): Promise<any> {
    const topic = params?.route?.topic;
    switch (topic) {
      case WebhookTopic.Connections:
        this.handleConnection(data);
        return { result: "Success" };
      case WebhookTopic.IssueCredential:
        this.handleIssueCredential(data as Data);
        return { result: "Success" };
      default:
        logger.warn(`Webhook ${topic} is not supported`)
        //return new NotImplemented(`Webhook ${topic} is not supported`);
        return { result: "Success" };
    }
  }

  private async handleConnection(data: Data): Promise<any> {
    // implement your connection webhook logic here
  }

  private async handleIssueCredential(data: Data): Promise<any> {
    switch (data.state) {
      case CredExState.RequestReceived:
        const attributes = data.credential_proposal_dict?.credential_proposal
          ?.attributes as AriesCredentialAttribute[];
        await this.app.service("aries-agent").create({
          service: ServiceType.CredEx,
          action: ServiceAction.Issue,
          data: {
            credential_exchange_id: data.credential_exchange_id,
            attributes: attributes,
          },
        });
        return { result: "Success" };
      case CredExState.Issued:
        console.log(
          `Credential issued for cred_ex_id ${data.credential_exchange_id}`
        );
        updateInviteRecord(
          { credential_exchange_id: data.credential_exchange_id },
          {
            issued: true,
            revoked: data.revocation_id ? false : undefined,
            revocation_id: data.revocation_id,
            revoc_reg_id: data.revoc_reg_id,
          },
          this.app
        );
        return { result: "Success" };
      default:
        console.warn(
          `Received unexpected state ${data.state} for cred_ex_id ${data.credential_exchange_id}`
        );
        return { status: `Unexpected state ${data.state}` };
    }
  }
}

export class TractionWebhooks {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async create(data: TractionData, params?: Params): Promise<any> {
    logger.warn(`Webhook ${data} received`)
    const topic = data.topic;
    switch (topic) {
      case WebhookTopic.Connections:
        this.handleConnection(data.payload);
        return { result: "Success" };
      case WebhookTopic.IssueCredential:
        this.handleIssueCredential(data.payload as Data);
        return { result: "Success" };
      default:
        logger.warn(`Webhook ${topic} is not supported`)
        //return new NotImplemented(`Webhook ${topic} is not supported`);
        return { result: "Success" };
    }
  }

  private async handleConnection(data: Data): Promise<any> {
    // implement your connection webhook logic here
  }

  private async handleIssueCredential(data: Data): Promise<any> {
    switch (data.state) {
      case CredExState.RequestReceived:
        const attributes = data.credential_proposal_dict?.credential_proposal
          ?.attributes as AriesCredentialAttribute[];
        await this.app.service("aries-agent").create({
          service: ServiceType.CredEx,
          action: ServiceAction.Issue,
          data: {
            credential_exchange_id: data.credential_exchange_id,
            attributes: attributes,
          },
        });
        return { result: "Success" };
      case CredExState.Issued:
        console.log(
          `Credential issued for cred_ex_id ${data.credential_exchange_id}`
        );
        updateInviteRecord(
          { credential_exchange_id: data.credential_exchange_id },
          {
            issued: true,
            revoked: data.revocation_id ? false : undefined,
            revocation_id: data.revocation_id,
            revoc_reg_id: data.revoc_reg_id,
          },
          this.app
        );
        return { result: "Success" };
      default:
        console.warn(
          `Received unexpected state ${data.state} for cred_ex_id ${data.credential_exchange_id}`
        );
        return { status: `Unexpected state ${data.state}` };
    }
  }
}
