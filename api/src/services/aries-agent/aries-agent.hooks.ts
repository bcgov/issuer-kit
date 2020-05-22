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
    all: [disallow("external")],
    create: [],
  },
};
