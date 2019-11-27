const attributes = [
  'userdisplayname',
  'emailaddress',
  'surname',
  'givenname',
  'birthdate',
  'streetaddress',
  'locality',
  'stateorprovince',
  'postalcode',
  'country'
];

const schemaDef = {
  attributes,
  schema_name: 'verified_person',
  schema_version: '1.2'
};

export default schemaDef;
