"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const invitation_validation_1 = require("./invitation.validation");
const prefix = 'VALIDATORS: ';
ava_1.default(prefix + 'validate invitations', t => {
    const obj = {
        email: 'xyz@example.com',
        method: 'github',
        jurisdiction: 'BC'
    };
    const result = invitation_validation_1.validateInvitation(obj);
    console.log(result);
    // t.is(result.value, obj);
    t.assert(result.errors === undefined);
});
