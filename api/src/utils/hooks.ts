import { Forbidden, MethodNotAllowed } from "@feathersjs/errors";
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
  const token = extractIdToken(
    context.params.headers?.authorization as string
  );
  if (!token) {
    throw new Forbidden("The authorization header is missing");
  }
  const keys = await getAuthSigningKeys(context);
  verifyIdToken(token, keys, context);
  return context;
}

export function verifyJWTRoles(roles: string[]) {
  return async (context: HookContext) => {
    const token = extractIdToken(
      context.params.headers?.authorization as string
    );
    if (!token) {
      throw new Forbidden("The authorization header is missing");
    }
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
    const token = extractIdToken(
      context.params.headers?.authorization as string
    );
    if (!token) {
      throw new Forbidden("The authorization header is missing");
    }
    const decoded = decode(token) as {
      [key: string]: any;
    };
    context.data[field] = decoded.preferred_username;
    logger.debug(`${field} set to ${decoded.preferred_username}`);
    return context;
  };
}

export async function validateCredentialRequest(context: HookContext) {
  const dbClient = (await context.app.get("mongoClient")) as Db;
  const idToken = extractIdToken(
    context.params.headers?.authorization as string
  );
  const keys = await getAuthSigningKeys(context);

  const decoded = verifyIdToken(idToken, keys, context);
  const inviteToken = await dbClient
    .collection("issuer-invite")
    .findOne({ token: context.data.token });
  const requestedSchema = context.app
    .get("public-schemas")
    .get(context.data.schema_id || "default");

  if (!decoded && !inviteToken && !requestedSchema) {
    throw new Forbidden(
      "The requested action could not be completed. Please check your settings and ensure you are either authenticated or requesting a public schema."
    );
  }
  return context;
}

async function getAuthSigningKeys(context: HookContext): Promise<SigningKey[]> {
  if (!context.app.get("authentication")) {
    logger.debug(
      "The [authentication] section is missing in the configuration"
    );
    return [] as SigningKey[];
  }
  // fetch public key from JWKS url and verify token
  const jwksOptions = {
    jwksUri: context.app.get("authentication").jwksUri,
  } as ClientOptions;
  const oidcClient = jwks(jwksOptions) as JwksClient;
  return (await oidcClient.getSigningKeysAsync()) as SigningKey[];
}

function verifyIdToken(
  idToken: string | undefined,
  keys: SigningKey[],
  context: HookContext
): string | undefined | object {
  if (!idToken || !context.app.get("authentication") || keys.length === 0) {
    return undefined;
  }
  let decoded;
  try {
    decoded = verify(idToken, keys[0].getPublicKey(), {
      algorithms: context.app.get("authentication").algorithms,
    });
  } catch (error) {
    logger.error(error);
    decoded = undefined;
  }
  return decoded;
}

function extractIdToken(authHeader: string | undefined): string | undefined {
  if (!authHeader || authHeader.split(" ").length === 1) {
    return undefined;
  }
  return authHeader.split(" ")[1];
}
