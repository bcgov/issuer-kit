import { HookContext } from "@feathersjs/feathers";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { validateEmail } from "../../utils/hook-validators";
import { sendEmail } from "../../utils/email";

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
    find: [],
    get: [],
    create: [
      validateEmail,
      async (context: HookContext) => {
        context.data.token = uuidv4();
        context.data.created_at = moment().toISOString(true);
        return context;
      },
    ],
    update: [
      validateEmail,
      async (context: HookContext) => {
        context.data.updated_at = moment().toISOString(true);
        return context;
      },
    ],
    patch: [
      validateEmail,
      async (context: HookContext) => {
        context.data.updated_at = moment().toISOString(true);
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
