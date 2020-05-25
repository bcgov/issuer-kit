import { HookContext } from "@feathersjs/feathers";

export default {
  before: {
    all: [],
    create: [],
  },

  after: {
    all: [],
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
    create: [],
  },
};
