import MSG from '@/constants/messages'
import { checkSchema, ParamSchema, validationResult } from 'express-validator'
import { validate } from '@/utils/validation'
import blogService from '@/services/blog.service'

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
const idSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.ID_IS_REQUIRED
  },
  isInt: {
    errorMessage: MSG.ID_MUST_BE_INT
  },
  toInt: true
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

export const updateBlogValidator = validate(
  checkSchema(
    {
      id: {
        ...idSchema,
        custom: {
          options: async (value: number) => {
            const blog = await blogService.isBlogExist({ id: value })
            if (!blog) {
              throw new Error(MSG.BLOG_NOT_FOUND)
            }
            return true
          }
        }
      },
      title: titleSchema,
      content: contentSchema
    },
    ['params', 'body']
  )
)

export const deleteBlogValidator = validate(
  checkSchema(
    {
      id: {
        ...idSchema,
        custom: {
          options: async (value: number) => {
            const blog = await blogService.isBlogExist({ id: value })
            if (!blog) {
              throw new Error(MSG.BLOG_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
