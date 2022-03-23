import { MongoClient } from "mongodb";
import { Application } from "./declarations";


function buildConnection(app:Application){
  const settings = app.get("mongodb");
  const connection = `mongodb://${settings.user}:${settings.password}@${settings.host}:${settings.port}/${settings.db}`;
  return connection
}

export async function dbStatus(app: Application){
  const connection = buildConnection(app);
  const client = new MongoClient(connection);
  var db_code = 200;
  await client.connect().then(()=>{
    client.close();
  }).catch(()=>{
    db_code = 503
  });
  return db_code
}

export default function (app: Application) {
  const connection = buildConnection(app);
  const database = connection.substr(connection.lastIndexOf("/") + 1);
  let serverSelectionTimeout = app.get("serverSelectionTimeout");
  if(!serverSelectionTimeout){
    serverSelectionTimeout = 30
  }
  const mongoClient = MongoClient.connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: serverSelectionTimeout*1000
  }).then((client) => {
    return client.db(database);
  })
  .catch((error) =>{
    console.error("Database connection failed", error);
    process.exit(1);
  });

  app.set("mongoClient", mongoClient);
}
