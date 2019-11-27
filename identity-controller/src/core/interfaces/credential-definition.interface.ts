export interface CredDefResponse {
  credential_definition_id: string;
}
export interface ICredDefGetResponse {
  credential_definition: CredentialDefinition;
}
export interface CredentialDefinition {
  ver: string;
  id: string;
  schemaId: string;
  type: string;
  tag: string;
  value: Value;
}
export interface Value {
  primary: Primary;
}
export interface Primary {
  n: string;
  s: string;
  r: R;
  rctxt: string;
  z: string;
}
export interface R {
  master_secret: string;
  degree: string;
  field: string;
}
