export interface IProofRecord {
  auto_present: true;
  thread_id: string;
  connection_id: string;
  presentation_request: {};
  created_at: string;
  updated_at: string;
  presentation: {};
  presentation_proposal_dict: {};
  verified: string;
  state: string;
  error_msg: string;
  initiator: string;
  presentation_exchange_id: string;
}

export interface IProofRecordsResponse {
  result: IProofRecord[];
}

export interface IRestrictions {
  schema_name: string;
  schema_version: string;
  credential_definition_id: string;
}
// TODO: expand this to be generics on requestedAttributes, requested_predicates;

interface IAttribute<T> {
  restrictions: IRestrictions;
  name: string;
  non_revoked?: any;
}

export type ProofAttributeType<T> = {
  [K in keyof T]: IAttribute<T[K]>;
};

interface IProofRequestSpecific<T> {
  requested_attributes: any;
}

export interface IProofRequest<T> {
  connection_id: string;
  proof_request: IProofRequestSpecific<T>;
}

export interface IProofProposalRequestResponseSend {
  name: string;
  version: string;
  requestedAttributes: any;
  nonce: string;
  requested_predicates: any;
  connection_id: string;
}

export const attributeTitleTransform = function<T>(
  key: ProofAttributeType<T>
): ProofAttributeType<T> {
  return key;
};

export interface IProofRequestedAttributes {
  requested_attributes: ProofAttributeType<string>;
}

export interface IProofProposalRequestResponse {
  auto_present: boolean;
  thread_id: string;
  connection_id: string;
  presentation_request: {};
  created_at: string;
  updated_at: string;
  presentation: {};
  presentation_proposal_dict: {};
  verified: string;
  state: string;
  error_msg: string;
  initiator: string;
  presentation_exchange_id: string;
}

export interface IProposalAttributes {
  name: string;
  cred_def_id: string;
  "mime-type": string;
  value: string;
}

export interface IProposalPredicates {
  name: string;
  cred_def_id: string;
  predicate: string;
  threshold: number;
}

export interface IProposalSend {
  presentation_proposal: {
    "@type": string;
    attributes: IProposalAttributes[];
    predicates: IProposalPredicates;
  };
  auto_present: boolean;
  comment: string;
  connection_id: string;
}

export interface IProofProposal {
  connection_id: string;
  proof_request: ProofRequest;
}
export interface ProofRequest {
  version: string;
  name: string;
  requested_predicates: RequestedPredicates;
  requested_attributes: RequestedAttributes;
}
export interface RequestedPredicates {}
export interface RequestedAttributes {
  [key: string]: IRestrictions;
}
export interface IRestrictions {
  name: string;
  restrictions?: RestrictionsEntity[] | null;
}
export interface RestrictionsEntity {
  issuer_did: string;
  schema_version: string;
  schema_id: string;
  cred_def_id: string;
  schema_name: string;
  // attr::corp_num::value: string;
}
