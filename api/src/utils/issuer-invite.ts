import { Application } from "@feathersjs/express";
import { Db } from "mongodb";

export async function updateInviteRecord(
  filter: any,
  fields: any,
  app: Application
) {
  const client: Promise<Db> = app.get("mongoClient");

  client.then((db) => {
    db.collection("issuer-invite").findOneAndUpdate(filter, { $set: fields });
  });
}
