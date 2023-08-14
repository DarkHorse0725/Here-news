import JoiBase from 'joi'
import { fileListExtension } from 'joi-filelist'

const Joi = fileListExtension(JoiBase)

const subscribeValidation = Joi.object({
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
  balance: Joi.any(),
  username: Joi.string().messages({
    'string.base': `"username" should be a type of 'text'`,
    'string.empty': `Username cannot be an empty field`,
    'string.min': `"username" should have a minimum length of {#limit}`,
    'any.required': `"username" is a required field`
  }),
  displayName: Joi.string().min(3).messages({
    'string.base': `Display Name should be a type of 'text'`,
    'string.empty': `Display Name cannot be an empty field`,
    'string.min': `Display Name should have atleast 3 characters`,
    'any.required': `DisplayName is a required field`
  }),
  password: Joi.string().min(8).messages({
    'string.base': `Password should be a type of 'text'`,
    'string.empty': `Password cannot be an empty field`,
    'string.min': `Password should have atleast 8 characters`,
    'any.required': `Password is a required field`
  }),
  retypepassword: Joi.string().equal(Joi.ref('password')).messages({
    'any.only': `Retype password must be same password`
  }),
  loginPassword: Joi.string().messages({
    'string.base': `Password should be a type of 'text'`,
    'string.empty': `Password cannot be an empty field`,
    'any.required': `Password is a required field`
  })
})

const loginValidation = Joi.object({
  username: Joi.string().messages({
    'string.base': `Email should be a type of 'text'`,
    'string.empty': `Email cannot be an empty field`,
    'any.required': `Email is a required field`
  }),
  password: Joi.string().messages({
    'string.base': `Password should be a type of 'text'`,
    'string.empty': `Password cannot be an empty field`,
    'any.required': `Password is a required field`
  })
})

export { subscribeValidation, loginValidation }
