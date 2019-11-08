"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
const invitationSchema = Joi.object({
    method: Joi.any().valid('github'),
    jurisdiction: Joi.any().valid('BC'),
    email: Joi.string().email()
});
const validateInvitation = (opts) => {
    return invitationSchema.validate(opts);
};
exports.validateInvitation = validateInvitation;
