export interface AriesCredentialDefinition {
  support_revocation: boolean;
  schema_id: string;
  tag: string;
}

export interface CredDefCreateServiceResponse {
  credential_definition_id: string;
  sent: any;
  txn: any;
}

export interface CredDefServiceResponse {
  credential_definition_id: string;
}
