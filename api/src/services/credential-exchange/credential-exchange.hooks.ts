import { HookContext } from "@feathersjs/feathers";
import { validateCredentialRequest } from "../../utils/hooks";

export default {
  before: {
    all: [],
    get: [],
    create: [validateCredentialRequest],
  },

  after: {
    all: [],
    get: [],
    create: [],
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
    get: [],
    create: [],
  },
};
