"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const database_model_1 = require("./database.model");
const prefix = 'VALIDATORS: ';
ava_1.default(prefix + 'validate invitations', t => {
    database_model_1.default.connect();
    // t.is(result.value, obj);
});
