import { HookContext } from "@feathersjs/feathers";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../../utils/email";
import { searchRegex, validateEmail } from "../../utils/hooks";

async function sendEmailIfRequired(context: HookContext) {
  if (!context.data.issued && !context.data.expired) {
    return sendEmail(context);
  }
  return context;
}

export default {
  before: {
    all: [
      // TODO: sanitize data
    ],
    find: [searchRegex],
    get: [],
    create: [
      validateEmail,
      async (context: HookContext) => {
        context.data.token = uuidv4();
        context.data.created_at = moment().toISOString(true);
        if (context.app.get("issuer").validityDays > 0) {
          context.data.expiry = moment().add(
            context.app.get("issuer").validityDays,
            "days"
          ).toDate();
        }
        return context;
      },
    ],
    update: [
      validateEmail,
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
      validateEmail,
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
    remove: [],
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
