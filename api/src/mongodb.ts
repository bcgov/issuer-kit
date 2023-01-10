import { MongoClient } from "mongodb";
import { Application } from "./declarations";


function buildConnection(app: Application) {
  const settings = app.get("mongodb");
  const connection = `mongodb://${settings.user}:${settings.password}@${settings.host}:${settings.port}/${settings.db}`;
  return connection
}

let db_status = false;

export async function dbStatus(app: Application) {
  if (!db_status) { //if initial connection failed return 503
    return 503
  }
  const connection = buildConnection(app);
  const client = new MongoClient(connection, { serverSelectionTimeoutMS: 1000 });
  let db_code = 200;
  await client.connect().then(() => {
    client.close();
  }).catch(() => {
    db_status = false
    db_code = 503
  });
  return db_code
}

export default function (app: Application) {
  const connection = buildConnection(app);
  const database = connection.substr(connection.lastIndexOf("/") + 1);
  let serverSelectionTimeout = app.get("serverSelectionTimeout");
  if (!serverSelectionTimeout) {
    serverSelectionTimeout = 30
  }
  const mongoClient = MongoClient.connect(connection, {
    serverSelectionTimeoutMS: serverSelectionTimeout * 1000
  }).then((client) => {
    db_status = true
    return client.db(database);
  })
    .catch((error) => {
      console.error("Database connection failed", error);
      process.exit(1);
    });

  app.set("mongoClient", mongoClient);
}
