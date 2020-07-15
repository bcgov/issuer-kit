/**
 * Example:
 * {
 * "connection_id": "5db4654c-9918-4d34-a656-427b6b6b271d",
 * "invitation": {
 *   "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation",
 *   "@id": "9ac0fb16-f946-44cf-b813-a44e4910695c",
 *   "recipientKeys": [
 *     "7Q5UAVJNHAphaQLeQzaBUZsGesYwyj69GSoA5KmJh4dD"
 *   ],
 *   "serviceEndpoint": "http://192.168.65.3:8021",
 *   "label": "issuer-kit-demo"
 * },
 * "invitation_url": "http://192.168.65.3:8021?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiOWFjMGZiMTYtZjk0Ni00NGNmLWI4MTMtYTQ0ZTQ5MTA2OTVjIiwgInJlY2lwaWVudEtleXMiOiBbIjdRNVVBVkpOSEFwaGFRTGVRemFCVVpzR2VzWXd5ajY5R1NvQTVLbUpoNGREIl0sICJzZXJ2aWNlRW5kcG9pbnQiOiAiaHR0cDovLzE5Mi4xNjguNjUuMzo4MDIxIiwgImxhYmVsIjogImlzc3Vlci1raXQtZGVtbyJ9",
 * "alias": "my_alias"
 * }
 */
export interface AriesInvitation {
  connection_id: string;
  invitation: {
    "@type": string;
    "@id": string;
    recipientKeys: string[];
    serviceEndpoint: string;
    label: string;
  };
  invitation_url: string;
  alias?: string;
}

/**
 * Example
 * {
 *   "created_at": "2020-05-23 00:40:24Z",
 *   "inbound_connection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   "alias": "Bob, providing quotes",
 *   "my_did": "WgWxqztrNooG92RXvxSTWv",
 *   "their_role": "Point of contact",
 *   "request_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   "initiator": "self",
 *   "their_label": "Bob",
 *   "invitation_key": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV",
 *   "invitation_mode": "once",
 *   "their_did": "WgWxqztrNooG92RXvxSTWv",
 *   "routing_state": "active",
 *   "connection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   "accept": "auto",
 *   "error_msg": "No DIDDoc provided; cannot connect to public DID",
 *   "state": "active",
 *   "updated_at": "2020-05-23 00:40:24Z"
 * }
 */
export interface AriesConnection {
  created_at: string;
  inbound_connection_id: string;
  alias: string;
  my_did: string;
  their_role: string;
  request_id: string;
  initiator: string;
  their_label: string;
  invitation_key: string;
  invitation_mode: string;
  their_did: string;
  routing_state: string;
  connection_id: string;
  accept: string;
  error_msg: string;
  state: string;
  updated_at: string;
}

export interface ConnectionServiceResponse {
  connection_id: string;
  state: string;
}
