import {
  AriesCredentialAttributes,
  AriesCredentialOffer,
} from "../models/credential-exchange";

export function formatCredentialOffer(
  connection_id: string,
  comment: string,
  attributes: AriesCredentialAttributes[],
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
