import moment from "moment";
import {
  AriesCredentialAttribute,
  AriesCredentialOffer,
  AriesCredentialPreview,
} from "../models/credential-exchange";

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
  const issued = {
    name: "issued",
    "mime-type": "text/plain",
    value: moment().toISOString(),
  } as AriesCredentialAttribute;
  return {
    "@type":
      "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
    attributes: [...attributes, issued],
  };
}
