import { Application } from "@feathersjs/express";
import { TokenValidationResponse } from "../models/token";
import { Db } from "mongodb";

export async function updateInviteRecord(
  filter: any,
  fields: any,
  app: Application
) {
  const client: Promise<Db> = app.get("mongoClient");

  client.then(async (db) => {
    await db
      .collection("issuer-invite")
      .findOneAndUpdate(filter, { $set: fields });
  });
}

function isIssued(issued: boolean, multiUse: boolean): boolean {
  if (multiUse) {
    return false;
  } else {
    return issued || multiUse;
  }
}

export async function isValidInvite(
  token: string,
  app: Application
): Promise<TokenValidationResponse> {
  const client: Promise<Db> = app.get("mongoClient");
  const issuer = app.get("issuer");

  return client.then(async (db) => {
    const invite = await db
      .collection("issuer-invite")
      .findOne({ token: token });

    if (!invite) {
      return { token: token } as TokenValidationResponse;
    }

    return {
      token: invite.token,
      issued: isIssued(invite.issued, issuer.multiUse),
      expired: invite.expiry?.getTime() <= Date.now(),
      data: invite.data,
    } as TokenValidationResponse;
  });
}
