export interface ICredHookResponse {
  state: string;
  auto_issue: boolean;
  credential_offer: CredentialOffer;
  created_at: string;
  thread_id: string;
  credential_request: CredentialRequest;
  credential_definition_id: string;
  initiator: string;
  updated_at: string;
  credential_exchange_id: string;
  auto_offer: boolean;
  credential_proposal_dict: CredentialProposalDict;
  credential: Credential;
  connection_id: string;
  schema_id: string;
}
export interface CredentialOffer {
  schema_id: string;
  cred_def_id: string;
  key_correctness_proof: KeyCorrectnessProof;
  nonce: string;
}
export interface KeyCorrectnessProof {
  c: string;
  xz_cap: string;
  xr_cap?: ((string)[] | null)[] | null;
}
export interface CredentialRequest {
  prover_did: string;
  cred_def_id: string;
  blinded_ms: BlindedMs;
  blinded_ms_correctness_proof: BlindedMsCorrectnessProof;
  nonce: string;
}
export interface BlindedMs {
  u: string;
  ur?: null;
  hidden_attributes?: (string)[] | null;
  committed_attributes: CommittedAttributesOrRCaps;
}
export interface CommittedAttributesOrRCaps {
}
export interface BlindedMsCorrectnessProof {
  c: string;
  v_dash_cap: string;
  m_caps: MCaps;
  r_caps: CommittedAttributesOrRCaps;
}
export interface MCaps {
  master_secret: string;
}
export interface CredentialProposalDict {
  '@type': string;
  '@id': string;
  comment: string;
  credential_proposal: CredentialProposal;
  cred_def_id: string;
}
export interface CredentialProposal {
  '@type': string;
  attributes?: (AttributesEntity)[] | null;
}
export interface AttributesEntity {
  name: string;
  value: string;
}
export interface Credential {
  schema_id: string;
  cred_def_id: string;
  rev_reg_id?: null;
  values: Values;
  signature: Signature;
  signature_correctness_proof: SignatureCorrectnessProof;
  rev_reg?: null;
  witness?: null;
}
export interface Values {
  givenname: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  locality: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  emailaddress: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  userdisplayname: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  country: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  stateorprovince: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  birthdate: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  surname: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  postalcode: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
  streetaddress: GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress;
}
export interface GivennameOrLocalityOrEmailaddressOrUserdisplaynameOrCountryOrStateorprovinceOrBirthdateOrSurnameOrPostalcodeOrStreetaddress {
  raw: string;
  encoded: string;
}
export interface Signature {
  p_credential: PCredential;
  r_credential?: null;
}
export interface PCredential {
  m_2: string;
  a: string;
  e: string;
  v: string;
}
export interface SignatureCorrectnessProof {
  se: string;
  c: string;
}
