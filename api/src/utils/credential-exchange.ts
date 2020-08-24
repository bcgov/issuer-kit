import moment from "moment";
import {
  AriesCredentialAttribute,
  AriesCredentialOffer,
  AriesCredentialPreview,
  CredExServiceResponse,
} from "../models/credential-exchange";
import { HookContext } from "@feathersjs/feathers";
import { ServiceType, ServiceAction } from "../models/enums";
import { GeneralError } from "@feathersjs/errors";

export function formatCredentialOffer(
  connection_id: string,
  comment: string,
  attributes: AriesCredentialAttribute[],
  cred_def_id: string
): AriesCredentialOffer {
  return {
    connection_id,
    comment,
    cred_def_id,
    credential_preview: {
      "@type":
        "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
      attributes: attributes,
    },
    auto_issue: false,
  };
}

export function formatCredentialPreview(
  attributes: AriesCredentialAttribute[]
): AriesCredentialPreview {
  return {
    "@type":
      "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
    attributes: attributes,
  };
}

export async function revokeCredential(context: HookContext) {
  await context.app.service("aries-agent").create({
    service: ServiceType.CredEx,
    action: ServiceAction.Revoke,
    data: {
      revocation_id: context.data.revocation_id,
      revoc_reg_id: context.data.revoc_reg_id,
    },
  });
  return context;
}
