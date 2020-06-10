import { AriesCredentialDefinition } from "../models/credential-definition";

export function formatCredentialDefinition(
  schema_id: string
): AriesCredentialDefinition {
  return {
    support_revocation: false,
    schema_id: schema_id,
    tag: "default",
  };
}
