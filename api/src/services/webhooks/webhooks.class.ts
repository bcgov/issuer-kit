import { NotImplemented } from "@feathersjs/errors";
import { Params } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import {
  CredExState,
  WebhookTopic,
  ServiceType,
  ServiceAction,
} from "../../models/enums";
import { updateInviteRecord } from "../../utils/issuer-invite";
import { AriesCredentialAttribute } from "../../models/credential-exchange";

interface Data {
  state?: CredExState;
  credential_exchange_id?: string;
  credential_proposal_dict?: any;
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
        this.handleIssueCredential(data);
        return { result: "Success" };
      default:
        return new NotImplemented(`Webhook ${topic} is not supported`);
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
          { issued: true },
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
