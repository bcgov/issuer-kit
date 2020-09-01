export enum ServiceAction {
  Create,
  Fetch,
  Issue,
  Revoke
}

export enum ServiceType {
  Connection,
  CredEx,
}

export enum WebhookTopic {
  Connections = "connections",
  IssueCredential = "issue_credential",
}

export enum CredExState {
  OfferSent = "offer_sent",
  RequestReceived = "request_received",
  Issued = "credential_issued",
}
