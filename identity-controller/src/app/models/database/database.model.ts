import * as mongo from 'mongodb';
import {
  AppConfigurationService,
  APP_SETTINGS,
} from '../../../core/services/app-configuration-service';
import { IInvitationRecord } from '../interfaces/invitation-record';
import { TypedEvent } from '../typed-event/typed-event.model';

export interface IDBEvent {
  operation: string;
  _id?: string;
  ref: string;
}

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
    this.database = AppConfigurationService.getSetting(APP_SETTINGS.DB_NAME);
    this.prefix = prefix;
  }

  static getInstance(options: { uri?: string; database?: string }) {
    if (!DBClient.instance) {
      if (!options || !options.uri) {
        throw new Error(
          prefix + 'No connection URI to the database was provided!',
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
  }): Promise<T> {
    const { collection, record } = opts;
    try {
      let res = await this.db(this.database)
        .collection<T>(collection)
        .insertOne(record);
      if (res.insertedId) {
        const data = res.ops[0] as any;
        return data as T;
      } else {
        throw new Error(this.prefix + 'failed to insert record');
      }
    } catch (err) {
      throw new Error(this.prefix + err.message);
    }
  }

  async updateRecord<T>(opts: {
    collection: DatabaseCollectionType;
    query: { [key: string]: string | Date | boolean };
    id: string;
  }): Promise<T> {
    const { collection, query, id } = opts;
    const _id = new mongo.ObjectId(id);
    try {
      let res = await this.db(this.database)
        .collection<T>(collection)
        // @ts-ignore
        .updateOne({ _id }, { $set: { ...query } });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async getRecords(
    collection: DatabaseCollectionType,
    opts: { count: number; batch: number; query: {} } = {
      count: 25,
      batch: 1,
      query: {},
    },
  ) {
    const { count, batch, query } = opts;
    try {
      let res = await this.db(this.database)
        .collection(collection)
        .find({});
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

  async getRecordByQuery<T>(opts: {
    collection: DatabaseCollectionType;
    query: { [key: string]: string };
  }) {
    const { collection, query } = opts;
    console.log('query', { ...query });
    let res = await this.db(this.database)
      .collection(collection)
      .findOne({ ...query });
    return res;
  }
}

export { DBClient };
