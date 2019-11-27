export interface ICredentialDefinitionDegree {
  name: string;
  date: string;
  degree: string;
  age: string;
}

export interface ICredPreview {
  type: any;
  attributes: any;
}

export interface OfferRequest {
  connectionId: string;
  credentialDefinitionId: string;
  comment: string;
  credentialPreview: ICredPreview;
}
