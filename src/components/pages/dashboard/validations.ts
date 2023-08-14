import JoiBase from 'joi'
import { fileListExtension } from 'joi-filelist'

const Joi = fileListExtension(JoiBase)

const updateProfileValidation = Joi.object({
  useremail: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .custom((value: string, helpers) => {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      const match = regex.test(value)

      if (!match) {
        return helpers.error('email.invalid')
      }

      return value
    })
    .messages({
      'string.email': `Ahh, snap! This email doesn’t look right.`,
      'string.empty': `Email cannot be an empty field`,
      'email.invalid': `Ahh, snap! This email doesn’t look right.`
    }),
  displayName: Joi.string().min(3).messages({
    'string.base': `Username should be a type of 'text'`,
    'string.empty': `Username cannot be an empty field`,
    'string.min': `Username should have atleast 3 characters`,
    'any.required': `Username is a required field`
  }),
  userIdHash: Joi.string().messages({
    'string.base': `User ID should be a type of 'text'`,
    'string.empty': `User ID cannot be an empty field`,
    'any.required': `User ID is a required field`
  })
})

export { updateProfileValidation }
