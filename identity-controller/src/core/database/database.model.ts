import * as mongo from 'mongodb';
import { TypedEvent } from '../typed-event/typed-event.model';
import { IInvitationRecord } from '../interfaces/invitation-record.interface';

export interface IDBEvent {
  operation: string;
  _id?: string;
  ref: string;
}

export type DatabaseNameType = 'identity';
export type DatabaseCollectionType = 'invitations';
export type DatabaseRecordType = IInvitationRecord;

const prefix = 'Database: ';

class DBClient extends mongo.MongoClient {
  private static instance: DBClient;

  events = new TypedEvent<IDBEvent>();
  database: string;
  private prefix: string;

  private constructor(opts: {
    uri?: string;
    options?: mongo.MongoClientOptions;
    database?: string;
  }) {
    super(opts.uri || '', opts.options || {});
    const prefix = 'database';
    this.database = 'identity';
    this.prefix = prefix;
  }

  static getInstance(options: { uri?: string; database?: string }) {
    if (!DBClient.instance) {
      if (!options || !options.uri) {
        throw new Error(
          prefix + 'No connection URI to the database was provided!'
        );
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

  async insertRecord<T>(opts: {
    collection: DatabaseCollectionType;
    record: T;
  }) {
    const { collection, record } = opts;
    try {
      let res = await this.db(this.database)
        .collection<T>(collection)
        .insertOne(record);
      if (res.insertedId) {
        const id = res.insertedCount;
        const objId = new mongo.ObjectID(id).toHexString();

        return objId;
      } else {
        throw new Error(this.prefix + 'failed to insert record');
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
    try {
      let res = await this.db(this.database)
        .collection(collection)
        .find({});
      const recs = await res.toArray();
      return await res.toArray();
    } catch (err) {
      throw new Error(prefix + 'database fetch failed with ' + err.message);
    }
  }

  async getRecord(opts: { collection: DatabaseCollectionType; id: string }) {
    const { collection, id } = opts;
    if (!id) throw new Error(this.prefix + 'no id entered');
    const _id = new mongo.ObjectId(id);
    try {
      let res = await this.db(this.database)
        .collection(collection)
        .findOne({ _id });
      console.log(res);
      return res;
    } catch (err) {}
  }
}

export { DBClient };
