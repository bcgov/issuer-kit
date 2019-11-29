const attributes = [
  'userdisplayname',
  'email',
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

const schemaDef = {
  attributes,
  schema_name: 'verified_person',
  schema_version: '1.22',
};

export default schemaDef;
