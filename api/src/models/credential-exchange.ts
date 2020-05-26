export interface AriesCredentialAttribute {
  name: string;
  "mime-type"?: string;
  value: string;
}

export interface AriesCredentialPreview {
  "@type": string;
  attributes: AriesCredentialAttribute[];
}

export interface AriesCredentialOffer {
  auto_issue?: boolean;
  auto_offer?: boolean;
  connection_id: string;
  comment: string;
  cred_def_id: string;
  credential_preview: AriesCredentialPreview;
}

export interface AriesCredentialExchange {
  credential_proposal_dict: any;
  auto_offer: false;
  revocation_id: string;
  auto_issue: false;
  connection_id: string;
  role: string;
  updated_at: string;
  created_at: string;
  thread_id: string;
  trace?: boolean;
  credential_definition_id: string;
  credential_offer: AriesCredentialOffer;
  parent_thread_id: string;
  initiator: string;
  revoc_reg_id: string;
  schema_id: string;
  credential_request: any;
  credential_exchange_id: string;
  credential_id: string;
  raw_credential: any;
  credential: any;
  auto_remove: boolean;
  credential_request_metadata: any;
  error_msg: string;
  state: string;
}

export interface CredExServiceResponse {
  credential_exchange_id: string;
  state: string;
}
