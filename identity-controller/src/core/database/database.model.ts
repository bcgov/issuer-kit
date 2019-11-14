import * as mongo from 'mongodb';
import { TypedEvent } from '../typed-event/typed-event.model';
import { MongoClient } from 'mongodb';

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

export type DatabaseNameType = 'data';
export type DatabaseCollectionType = 'invitations';
export type DatabaseRecordType = IInvitationRecord;

class DBClient extends mongo.MongoClient {
  private static instance: DBClient;

  events = new TypedEvent<IDBEvent>();

  private constructor (opts: { uri?: string; options?: mongo.MongoClientOptions }) {
    super(
      opts.uri || '',
      opts.options || {}
    );
  }

  static getInstance(options: {uri?: string}) {
    if (!DBClient.instance) {  
      if (!options || !options.uri) {
        throw new Error('No connection URI to the database was provided!');
      }
      DBClient.instance = new DBClient(options);
    }
    return DBClient.instance;
  }

  addListeners() {
    this.db('data')
      .collection('invitations')
      .watch([{ $project: { documentKey: false } }])
      .on('change', change => {
        console.log('changed thingy', change);
      });
  }

  async insertRecord(opts: {
    collection: DatabaseCollectionType;
    record: DatabaseRecordType;
    ref: string;
  }) {
    const { collection, record, ref } = opts;
    if (!this.isConnected()) throw new Error('db not connected');
    try {
      let res = await this.db('data')
        .collection(collection)
        .insertOne(record);
      console.log('res', res);
      if (res.result) return this.emit(ref, { res, ref });
    } catch (err) {
      return new Error(err.message);
    }
  }
}

export {DBClient}
