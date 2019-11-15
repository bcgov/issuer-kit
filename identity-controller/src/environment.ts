export const vars = [
  'NODE_ENV',
  'DEBUG',
  'WA_ADMIN_PORT',
  'WA_PUBLIC_PORT',
  'MONGODB_ADMIN_PASSWORD',
  'MONGODB_USER',
  'MONGODB_PASSWORD',
  'MONGODB_DATABASE',
  'MONGODB_PORT',
  'KEYCLOAK_DB_VENDOR',
  'KEYCLOAK_DB_ADDR',
  'KEYCLOAK_USER',
  'KEYCLOAK_PASSWORD',
  'KEYCLOAK_IMPORT',
  'KEYCLOAK_LOGLEVEL',
  'KEYCLOAK_ROOT_LOGLEVEL',
  'KEYCLOAK_PORT',
  'KEYCLOAK_DB_NAME',
  'KEYCLOAK_DB_USER',
  'KEYCLOAK_DB_PASSWORD',
  'WALLET_HOST',
  'WALLET_PORT',
  'WALLET_USER',
  'WALLET_PASSWORD',
  'WALLET_DATABASE',
  'WALLET_ADMIN_PASSWORD',
  'LEDGER_URL',
  'AGENT_WALLET_NAME',
  'AGENT_WALLET_ENCRYPTION_KEY',
  'AGENT_STORAGE_WALLET_TYPE',
  'AGENT_WALLET_SEED',
  'AGENT_ADMIN_PORT',
  'AGENT_WEBHOOK_PORT',
  'AGENT_WEBHOOK_URL',
  'AGENT_HTTP_INTERFACE_PORT',
  'AGENT_NAME',
  'AGENT_ENDPOINT',
  'AGENT_ADMIN_MODE',
  'IDENTITY_CONTROLLER_PORT',
  'IDENTITY_CONTROLLER_HOOK_PORT',
  'AGENT_ADMIN_URL',
  'DB_SERVICE',
  'IDENTITY_CONTROLLER_PORT',
  'IDENTITY_CONTROLLER_HOOK_PORT',
  'AGENT_ADMIN_URL',
  'DB_SERVICE'
];

function match(itm) {
  return itm;
}

function processMap(fn) {
  return function spreadFn(argsArr) {
    return fn(...argsArr);
  };
}

// function compose(arr) {

//   return function spreadArgs(arr) {
//     return (...arr);
//   };
// }

// function spread(fn) {
//   return (...arr) => fn(arr);
// }

function getOne(fn) {
  return function(itm) {
    return itm.reduce(itm => fn(...itm));
  };
}

// const data = vcompose(match);
const data = [getOne(match)(vars)];
export default data; // 12

// const spreadOver = fn => argsArr => fn(...argsArr);
