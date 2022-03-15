import { MongoClient } from "mongodb";
import { Application } from "./declarations";

export default function (app: Application) {
  const settings = app.get("mongodb");
  const connection = `mongodb://${settings.user}:${settings.password}@${settings.host}:${settings.port}/${settings.db}`;
  const database = connection.substr(connection.lastIndexOf("/") + 1);
  let serverSelectionTimeout = app.get("serverSelectionTimeout");
  if(!serverSelectionTimeout){
    serverSelectionTimeout = 30
  }
  const mongoClient = MongoClient.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: serverSelectionTimeout*1000
  }).then((client) => client.db(database))
  .catch((error) =>{
    console.error("Database connection failed", error);
    process.exit(1);
  });

  app.set("mongoClient", mongoClient);
}
