import JoiBase from 'joi'
import { fileListExtension } from 'joi-filelist'

const Joi = fileListExtension(JoiBase)

const subscribeValidation = Joi.object({
  useremail: Joi.string().email({ tlds: { allow: false } })
})

export { subscribeValidation }
