import { HookContext } from "@feathersjs/feathers";

export default {
  before: {
    all: [],
    get: [],
    create: [],
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
