import { HookContext } from "@feathersjs/feathers";
import { disallow } from "feathers-hooks-common";

export default {
  before: {
    all: [disallow("external")],
    create: [],
  },

  after: {
    all: [disallow("external")],
    create: [],
  },

  error: {
    all: [
      disallow("external"),
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
