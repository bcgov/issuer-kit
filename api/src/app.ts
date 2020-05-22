import configuration from "@feathersjs/configuration";
import express from "@feathersjs/express";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio";
import compress from "compression";
import cors from "cors";
import swagger, { SwaggerService } from "feathers-swagger";
import helmet from "helmet";
import path from "path";
import favicon from "serve-favicon";
import appHooks from "./app.hooks";
import channels from "./channels";
import { Application } from "./declarations";
import logger from "./logger";
import middleware from "./middleware";
import mongodb from "./mongodb";
import { internalServices, services } from "./services";

// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get("public"), "favicon.ico")));
// Host the public folder
app.use("/", express.static(app.get("public")));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());
app.configure(mongodb);

// Set up internal services that will not be documented in swagger
app.configure(internalServices);

// Set up swagger docs
app.configure(
  swagger({
    openApiVersion: 3,
    docsPath: "/swagger/docs",
    docsJsonPath: "/swagger/jsondocs",
    uiIndex: true,
    specs: {
      info: {
        title: "API",
        description: "Issuer Kit API",
        version: "1.0.0",
      },
      definitions: {
        ISODateFormat: {
          description: "ISO format date-time.",
          example: "2020-01-01T01:01:01.001Z",
          format: "date-time",
          readOnly: true,
          type: "string",
        },
      },
    },
    defaults: {
      schemasGenerator(
        service: SwaggerService<any>,
        model: string,
        modelName: string
      ) {
        return {
          [model]: service.model,
          [`${model}_list`]: {
            title: `${modelName} list`,
            type: "array",
            items: {
              $ref: `#/components/schemas/${model}`,
            },
          },
        };
      },
    },
  })
);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our publicly accessible services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

export default app;
