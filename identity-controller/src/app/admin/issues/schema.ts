export interface ISchemaDefinition {
  attributes: string[];
  schema_name: string;
  schema_version: string;
}

export class DefaultSchemaDefinition implements ISchemaDefinition {
  attributes: string[];
  schema_name: string;
  schema_version: string;

  constructor() {
    this.attributes = [
      'given_names',
      'family_name',
      'birthdate',
      'street_address',
      'postal_code',
      'locality',
      'region',
      'country',
      'issued',
    ];

    this.schema_name = 'verified_person';
    this.schema_version = '1.4.0';
  }
}
