import { MethodNotAllowed } from "@feathersjs/errors";
import { HookContext } from "@feathersjs/feathers";
import { Db, ObjectId } from "mongodb";

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
