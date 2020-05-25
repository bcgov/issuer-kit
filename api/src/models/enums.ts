export enum ServiceAction {
  Create,
  Fetch,
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
  Issued = "issued",
  Stored = "stored",
}
