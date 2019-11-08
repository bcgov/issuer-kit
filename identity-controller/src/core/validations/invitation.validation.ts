import * as Joi from '@hapi/joi';

const invitationSchema = Joi.object({
  method: Joi.any().valid('github'),
  jurisdiction: Joi.any().valid('BC'),
  email: Joi.string().email()
});

const validateInvitation = (opts: {method: string, jurisdiction: string, email: string}) => {
  return invitationSchema.validate(opts)
}

export { validateInvitation };
