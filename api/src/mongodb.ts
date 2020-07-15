import { MongoClient } from "mongodb";
import { Application } from "./declarations";

export default function (app: Application) {
  const settings = app.get("mongodb");
  const connection = `mongodb://${settings.user}:${settings.password}@${settings.host}:${settings.port}/${settings.db}`;
  const database = connection.substr(connection.lastIndexOf("/") + 1);
  const mongoClient = MongoClient.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((client) => client.db(database));

  app.set("mongoClient", mongoClient);
}
