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
      'userdisplayname',
      'surname',
      'givenname',
      'birthdate',
      'streetaddress',
      'locality',
      'stateorprovince',
      'postalcode',
      'country',
      'issued',
    ];

    this.schema_name = 'verified_person';
    this.schema_version = '1.3.0';
  }
}
