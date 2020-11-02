import {
  Forbidden,
  MethodNotAllowed,
  NotAuthenticated,
} from "@feathersjs/errors";
import { HookContext } from "@feathersjs/feathers";
import { decode, verify } from "jsonwebtoken";
import jwks, { ClientOptions, JwksClient, SigningKey } from "jwks-rsa";
import { Db, ObjectId } from "mongodb";
import logger from "../logger";

export async function validateEmail(context: HookContext) {
  const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegexp.test(context.data.email)) {
    throw new Error("The provided email address is not valid");
  }
  return context;
}

export async function searchRegex(context: HookContext) {
  const query = context.params.query;
  for (let field in query) {
    if (field === "email") {
      query[field] = { $regex: new RegExp(query[field], "i") };
    }
  }
  context.params.query = query;
  return context;
}

export async function canDeleteInvite(context: HookContext) {
  const client: Promise<Db> = context.app.get("mongoClient");

  return await client.then(async (db) => {
    const invite = await db
      .collection("issuer-invite")
      .findOne({ _id: new ObjectId(context.id) });

    if (invite.revoked === undefined) {
      return context;
    } else {
      throw new MethodNotAllowed(
        "Cannot delete invites for revocable credentials"
      );
    }
  });
}

export async function verifyJWT(context: HookContext) {
  const authHeader = context.params.headers?.authorization as string;
  if (!authHeader) {
    return Promise.reject(new Forbidden("The authorization header is missing"));
  }
  const token = authHeader.split(" ")[1];

  // fetch public key from JWKS url and verify token
  const jwksOptions = {
    jwksUri: context.app.get("authentication").jwksUri,
  } as ClientOptions;
  const client = jwks(jwksOptions) as JwksClient;
  const keys = (await client.getSigningKeysAsync()) as SigningKey[];

  let decoded;
  try {
    decoded = verify(token, keys[0].getPublicKey(), {
      algorithms: context.app.get("authentication").algorithms,
    });
  } catch (error) {
    throw new NotAuthenticated(`Authentication failed: ${error.message}`);
  }
  return context;
}

export function verifyJWTRoles(roles: string[]) {
  return async (context: HookContext) => {
    const authHeader = context.params.headers?.authorization as string;
    if (!authHeader) {
      throw new Forbidden("The authorization header is missing");
    }
    const token = authHeader.split(" ")[1];

    const decoded = decode(token) as {
      [key: string]: any;
    };
    const tokenRoles = decoded.roles as string[];
    roles.forEach((role: string) => {
      if (!tokenRoles.includes(role)) {
        logger.debug(`Required role ${role} is missing!`);
        throw new Forbidden("The user does not have all the required roles");
      }
    });
    return context;
  };
}

export function setRequestUser(field: string) {
  return async (context: HookContext) => {
    const authHeader = context.params.headers?.authorization as string;
    if (!authHeader) {
      throw new Forbidden("The authorization header is missing");
    }
    const token = authHeader.split(" ")[1];

    const decoded = decode(token) as {
      [key: string]: any;
    };
    context.data[field] = decoded.preferred_username;
    logger.debug(`${field} set to ${decoded.preferred_username}`);
    return context;
  };
}

export async function validateCredentialRequest(context: HookContext) {
  const authHeader = context.params.headers?.authorization as string;
  const idToken = authHeader.split(" ")[1];

  // fetch public key from JWKS url and verify token
  const jwksOptions = {
    jwksUri: context.app.get("authentication").jwksUri,
  } as ClientOptions;
  const client = jwks(jwksOptions) as JwksClient;
  const keys = (await client.getSigningKeysAsync()) as SigningKey[];

  let decoded;
  try {
    decoded = verify(idToken, keys[0].getPublicKey(), {
      algorithms: context.app.get("authentication").algorithms,
    });
  } catch (error) {
    decoded = undefined;
  }

  const inviteToken = context.data.token;
  const requestedSchema = context.app
    .get("public-schemas")
    .get(context.data.schema_id || "default");

  if (!decoded || !inviteToken || !requestedSchema) {
    throw new Forbidden(
      "The requested action could not be completed. Please check your settings and ensure you are either authenticated or requesting a public schema."
    );
  }
  return context;
}
