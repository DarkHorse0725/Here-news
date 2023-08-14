import JoiBase from 'joi'

// TODO: remove joi file package
const Joi = JoiBase

// min 17 characters, because its being used in richTextEditor and 7 characters are for html tag
const postValidation = Joi.object({
  content: Joi.string()
    .custom((value, helpers) => {
      let content = value
      content = content.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, '')
      if (content === '') {
        return helpers.error('string.noOnlySpaces')
      }
      return value
    }, 'noOnlySpaces')
    .min(17)
    .messages({
      'any.empty': 'Content is required',
      'any.required': 'Content is required',
      'string.empty': 'Content is required',
      'string.required': 'Content is required',
      'string.min': 'Content must be at least 10 characters long',
      'string.noOnlySpaces': 'Text content is required!'
    }),
  title: Joi.string()
    .optional() // Title is optional
    .empty('') // it can be empty
    .max(160) // Max 104 characters
    .custom((value: string, helpers) => {
      const regex = /https?:\/\//g
      const match = regex.test(value)

      if (match) {
        return helpers.error('title.noURLAllowed')
      }

      return value
    }) // Make sure no urls are present
    .messages({
      'string.max': 'Title must be 104 characters max',
      'title.noURLAllowed': 'No urls allowed in the title'
    })
})

export { postValidation }
