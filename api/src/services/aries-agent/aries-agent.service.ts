// Initializes the `aries-agent` service on path `/aries-agent`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { AriesAgent } from "./aries-agent.class";
import hooks from "./aries-agent.hooks";

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    "aries-agent": AriesAgent & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {};

  // Initialize our service with any options it requires
  app.use("/aries-agent", new AriesAgent(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("aries-agent");

  service.hooks(hooks);
}
