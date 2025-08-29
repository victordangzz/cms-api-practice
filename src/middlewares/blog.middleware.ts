import MSG from '@/constants/messages'
import { checkSchema, ParamSchema, validationResult } from 'express-validator'
import { validate } from '@/utils/validation'


const titleSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.TITLE_IS_REQUIRED
  },
  isString: {
    errorMessage: MSG.TITLE_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 5,
      max: 100
    },
    errorMessage: MSG.TITLE_LENGTH
  }
}

const contentSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.CONTENT_IS_REQUIRED
  },
  isString: {
    errorMessage: MSG.CONTENT_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 10,
      max: 5000
    },
    errorMessage: MSG.CONTENT_LENGTH
  }
}

export const createBlogValidator = validate(
  checkSchema(
    {
      title: titleSchema,
      content: contentSchema
    },
    ['body']
  )
)
