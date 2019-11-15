import * as mongo from 'mongodb';
import { TypedEvent } from '../typed-event/typed-event.model';

export interface IDBEvent {
  operation: string;
  _id?: string;
  ref: string;
}

export interface IInvitationRecord {
  _id?: any;
  consumed: boolean;
  method: string;
  email: string;
  jurisdiction: string;
}

export type DatabaseNameType = 'identity';
export type DatabaseCollectionType = 'invitations';
export type DatabaseRecordType = IInvitationRecord;

const prefix = 'Database: ';
const databaseName = 'data';

const startupArgs = { prefix, databaseName };

class DBClient extends mongo.MongoClient {
  private static instance: DBClient;

  events = new TypedEvent<IDBEvent>();
  database: string;
  private prefix: string;

  private constructor(opts: {
    uri?: string;
    options?: mongo.MongoClientOptions;
  }) {
    super(opts.uri || '', opts.options || {});
    const { prefix, databaseName } = startupArgs;
    this.database = databaseName;
    this.prefix = prefix;
  }

  static getInstance(options: { uri?: string }) {
    if (!DBClient.instance) {
      if (!options || !options.uri) {
        throw new Error('No connection URI to the database was provided!');
      }
      DBClient.instance = new DBClient(options);
    }

    return DBClient.instance;
  }

  addListeners() {
    this.db(this.database)
      .collection('invitations')
      .watch([{ $project: { documentKey: false } }])
      .on('change', change => {
        console.log('changed thingy', change);
      });
  }

  async insertRecord(opts: {
    collection: DatabaseCollectionType;
    record: DatabaseRecordType;
  }) {
    const { collection, record } = opts;
    if (!this.isConnected()) throw new Error('db not connected');
    try {
      let res = await this.db(this.database)
        .collection(collection)
        .insertOne(record);
      console.log('res', res);
      if (res.result) {
        return res;
      }
    } catch (err) {
      throw new Error(this.prefix + err.message);
    }
  }
  async getRecords(
    collection: DatabaseCollectionType,
    opts: { count: number; batch: number; query: {} } = {
      count: 25,
      batch: 1,
      query: {}
    }
  ) {
    const { count, batch, query } = opts;
    if (!this.isConnected()) throw new Error('db not connected');
    try {
      let res = await this.db(this.database)
        .collection(collection)
        .find({});
      return res;
    } catch (err) {
      throw new Error(prefix + 'database fetch failed with ' + err.message);
    }
  }

  async getRecord(opts: { collection: DatabaseCollectionType; id: string }) {
    const { collection, id } = opts;
    if (!id) throw new Error(this.prefix + 'no id entered');
    try {
      let res = await this.db(this.database)
        .collection(collection)
        .findOne({ id });
      return res;
    } catch (err) {}
  }
}

export { DBClient };
