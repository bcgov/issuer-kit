// Initializes the `webhooks` service on path `/webhooks/:topic`
import { ServiceAddons } from "@feathersjs/feathers";
import { Application } from "../../declarations";
import { Webhooks } from "./webhooks.class";
import { TractionWebhooks } from "./webhooks.class";
import hooks from "./webhooks.hooks";

// Add this service to the service type index
declare module "../../declarations" {
  interface ServiceTypes {
    "webhooks/topic/:topic": Webhooks & ServiceAddons<any>;
    "webhooks/traction/:tenant": TractionWebhooks & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {};

  // Initialize our service with any options it requires
  app.use("/webhooks/topic/:topic", new Webhooks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("webhooks/topic/:topic");

  service.hooks(hooks);

  // Initialize our service with any options it requires
  app.use("/webhooks/traction/:tenant", new TractionWebhooks(options, app));

  // Get our initialized service so that we can register hooks
  const tractionService = app.service("webhooks/traction/:tenant");

  tractionService.hooks(hooks);
}
