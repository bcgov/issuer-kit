const attributes = [
  'userdisplayname',
  'emailaddress',
  'surname',
  'givenname',
  'birthdate',
  'age',
  'streetaddress',
  'locality',
  'stateorprovince',
  'postalcode',
  'country'
];

const schemaDef = {
  attributes,
  schema_name: 'verified_person',
  schema_version: '1.1'
};

export default schemaDef;
