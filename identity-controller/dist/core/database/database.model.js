"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo = require("mongodb");
const typed_event_model_1 = require("../typed-event/typed-event.model");
class Database extends mongo.MongoClient {
    constructor(opts) {
        super(opts.uri || process.env.DATABASE_URI || 'mongodb://localhost:27017', opts.options || {});
        this.events = new typed_event_model_1.TypedEvent();
    }
    addListeners() {
        console.log(this.db);
    }
}
const db = new Database({});
exports.default = db;
