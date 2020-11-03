/**
 * Example:
 * "schema_id": "GSqQTPcQVdLtBYYSgBJXai:2:prefs:1.0",
 * "schema": {
 *   "ver": "1.0",
 *   "id": "GSqQTPcQVdLtBYYSgBJXai:2:prefs:1.0",
 *   "name": "prefs",
 *   "version": "1.0",
 *   "attrNames": [
 *     "score"
 *   ],
 *   "seqNo": 8
 * }
 */
export interface AriesSchema {
  schema_id?: string;
  schema: {
    ver: string;
    id: string;
    name: string;
    version: string;
    attrNames: string[];
    seqNo: number;
  };
}

export interface SchemaDefinition {
  id?: string;
  schema_version?: string;
  schema_name?: string;
  attributes?: string[];
  revocable?: boolean;
  tag?: string;
  default?: boolean;
  public?: boolean;
}
