export type AuditType = 'edit' | 'create';

export interface IAuditRecord {
  created: number;
  type: AuditType;
}
