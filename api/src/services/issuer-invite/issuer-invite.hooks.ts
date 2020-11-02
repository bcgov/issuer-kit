import { HookContext } from "@feathersjs/feathers";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { revokeCredential } from "../../utils/credential-exchange";
import { sendEmail } from "../../utils/email";
import {
  canDeleteInvite,
  searchRegex,
  setRequestUser,
  validateEmail,
  verifyJWT,
  verifyJWTRoles,
} from "../../utils/hooks";

async function sendEmailIfRequired(context: HookContext) {
  if (!context.data.issued && !context.data.expired) {
    return sendEmail(context);
  }
  return context;
}

async function handleRevocation(context: HookContext) {
  if (
    context.data.revoked &&
    context.data.revocation_id &&
    context.data.revoc_reg_id
  ) {
    await revokeCredential(context);
    const revocation_history = (context.data.revocation_history as any[]) || [];
    revocation_history.push({
      revocation_id: context.data.revocation_id,
      revoc_reg_id: context.data.revoc_reg_id,
      reissue_date: moment().toISOString(true),
    });
    context.data.revoc_reg_id = undefined;
    context.data.revocation_id = undefined;
    context.data.revocation_history = revocation_history;
  } else if (
    !context.data.revoked &&
    context.data.revocation_id &&
    context.data.revoc_reg_id
  ) {
    context.data.issued = false;
  }
  return context;
}

export default {
  before: {
    all: [verifyJWT, verifyJWTRoles(["admin"])],
    find: [searchRegex],
    get: [],
    create: [
      setRequestUser("created_by"),
      validateEmail,
      async (context: HookContext) => {
        context.data.token = uuidv4();
        context.data.created_at = moment().toISOString(true);
        if (context.app.get("issuer").validityDays > 0) {
          context.data.expiry = moment()
            .add(context.app.get("issuer").validityDays, "days")
            .toDate();
        }
        return context;
      },
    ],
    update: [
      setRequestUser("updated_by"),
      validateEmail,
      handleRevocation,
      async (context: HookContext) => {
        context.data.updated_at = moment().toISOString(true);
        if (context.data.expired) {
          context.data.expiry = moment().toDate();
        } else {
          context.data.expiry = undefined;
        }
        return context;
      },
    ],
    patch: [
      setRequestUser("updated_by"),
      validateEmail,
      handleRevocation,
      async (context: HookContext) => {
        context.data.updated_at = moment().toISOString(true);
        if (context.data.expired) {
          context.data.expiry = moment().toDate();
        } else {
          context.data.expiry = undefined;
        }
        return context;
      },
    ],
    remove: [canDeleteInvite],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [sendEmailIfRequired],
    update: [sendEmailIfRequired],
    patch: [sendEmailIfRequired],
    remove: [],
  },

  error: {
    all: [
      async (context: HookContext) => {
        console.error(
          `Error in ${context.path} calling ${context.method}  method`,
          context.error
        );
        return context;
      },
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
