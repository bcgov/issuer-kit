export enum ServiceAction {
  Create,
  Fetch,
  Issue,
}

export enum ServiceType {
  Connection,
  CredEx,
  CredDef,
}

export enum WebhookTopic {
  Connections = "connections",
  IssueCredential = "issue_credential",
}

export enum CredExState {
  OfferSent = "offer_sent",
  RequestReceived = "request_received",
  Issued = "issued",
}
