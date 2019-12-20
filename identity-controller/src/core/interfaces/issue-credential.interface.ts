export interface ICredentialRecord {
  referent: string;
  _id: string;
  attrs: {
    [key: string]: string;
  }[];
  schema_id: string;
  cred_def_id: string;
  rev_reg_id: string;
  cred_rev_id: string;
}

export interface cred_proposal {
  credential_proposal: {
    attributes: any[];
    comment: string;
    cred_def_id: string;
    '@id': string;
    '@type': string;
  };
}

export interface IRecordsResult {
  thread_id: string;
  created_at: string;
  updated_at: string;
  error_msg: string;
  state: string;
  initiator: string;
  proposal: cred_proposal;
  credential_proposal_dict: cred_proposal;
  credential_id: string;
  raw_credential: {};
  auto_offer: true;
  connection_id: string;
  credential_definition_id: string;
  credential_offer: {};
  auto_issue: boolean;
  credential_request: {};
  credential: any;
  schema_id: string;
  parent_thread_id: string;
  credential_exchange_id: string;
  credential_request_metadata: {};
  role: string;
}

export interface ICredentialAttributes {
  name: string;
  'mime-type'?: string;
  value: string;
}

export interface ICredentialProposal {
  '@type'?: string;

  attributes: ICredentialAttributes[];
}

export interface IIssueSend {
  credential_proposal?: ICredentialProposal;
  // credential_definition_id: {
  credential_definition_id: string;
  // };
  comment: string;
  connection_id: string;
  credential_preview?: any;
  auto_issue?: boolean;
  auto_offer?: boolean;
}

export interface ICredentialPreview {
  '@type'?: string;
  attributes: ICredentialAttributes[];
}

export interface IIssueOffer {
  auto_issue?: boolean;
  auto_offer?: boolean;
  connection_id: string;
  comment: string;
  cred_def_id: string;
  credential_preview: ICredentialPreview;
}

export interface ICredentialSendResponse {
  credential_proposal_dict: any;
  state: string;
  credential_request: any;
  updated_at: string;
  raw_credential: any;
  credential: any;
  initiator: string;
  credential_definition_id: string;
  credential_request_metadata: any;
  schema_id: string;
  credential_offer: any;
  auto_offer: boolean;
  credential_id: string;
  error_msg: string;
  parent_thread_id: string;
  created_at: string;
  thread_id: string;
  credential_exchange_id: string;
  connection_id: string;
  auto_issue: boolean;
}

export interface ICredentialSendProposalResponse {
  credential_proposal_dict: any;
  state: string;
  credential_request: any;
  updated_at: string;
  raw_credential: any;
  credential: any;
  initiator: string;
  credential_definition_id: string;
  credential_request_metadata: any;
  schema_id: string;
  credential_offer: any;
  auto_offer: true;
  credential_id: string;
  error_msg: string;
  parent_thread_id: string;
  created_at: string;
  thread_id: string;
  credential_exchange_id: string;
  connection_id: string;
  auto_issue: boolean;
}

export interface ICredExRecordResponse {
  credential: any;
  credential_offer: any;
  parent_thread_id: string;
  credential_id: string;
  credential_proposal_dict: any;
  created_at: string;
  connection_id: string;
  updated_at: string;
  credential_request: any;
  credential_request_metadata: any;
  auto_issue: boolean;
  thread_id: string;
  raw_credential: any;
  schema_id: string;
  auto_offer: boolean;
  error_msg: string;
  initiator: string;
  credential_definition_id: string;
  credential_exchange_id: string;
  state: string;
}
