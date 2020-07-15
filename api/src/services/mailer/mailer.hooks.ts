import { disallow } from "feathers-hooks-common";

export default {
  before: {
    all: [disallow("external")],
  },

  after: {
    all: [disallow("external")],
  },

  error: {
    all: [disallow("external")],
  },
};
