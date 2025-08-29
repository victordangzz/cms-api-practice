import { NextFunction, Request, Response } from 'express'
import { checkSchema, ParamSchema, validationResult } from 'express-validator'
import { validate } from '@/utils/validation'
import MSG from '@/constants/messages'
import userService from '@/services/user.service'
import { comparePassword } from '@/utils/crypto'
import prismaService from '@/services/prisma.service'
import { TokenPayLoad } from '@/models/requests/user.request'
import { UserLoginReqBody } from '@/models/requests/user.request'
import { verifyToken } from '@/utils/jwt'
import { ErrorsWithStatus } from '@/models/Errors'
import HTTP_STATUS_CODE from '@/constants/httpStatusCode'
import { CONFIG_ENV } from '@/constants/config'
import { JsonWebTokenError} from 'jsonwebtoken'
import { capitalize } from 'lodash'

// cái tiếp theo là đường dẫn nên chú ý sao cho gọn nhất có thể chứ đừng có ../ hoặc ../../ hoặc ../../../ không hay và nhìn rất rối em nha
// Chỗ đường dẫn này a recommend em dùng cái allias path typescript để a đi làm lại a sẽ nói rõ chỗ này và nó chỉ là custom đường dẫn thôi.

const emailSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.EMAIL_IS_REQUIRED
  },
  isString: {
    errorMessage: MSG.EMAIL_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 5,
      max: 160
    },
    errorMessage: MSG.EMAIL_LENGTH
  },
  isEmail: {
    errorMessage: MSG.EMAIL_INVALID
  }
}

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.PASSWORD_IS_REQUIRED
  },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 160
    },
    errorMessage: MSG.PASSWORD_LENGTH
  }
}
const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: MSG.CONFIRM_PASSWORD_IS_REQUIRED
  },
  custom: {
    options: (value: string, { req }) => {
      if (value !== req.body.password) {
        throw new Error(MSG.PASSWORDS_DO_NOT_MATCH)
      }
      return true
    }
  }
}
const nameSchema: ParamSchema = {
  isString: {
    errorMessage: MSG.NAME_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 3,
      max: 160
    },
    errorMessage: MSG.NAME_LENGTH
  }
}
export const registerValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string) => {
            const user = await userService.isExistUser(value)
            if (user) {
              throw new Error(MSG.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
      name: nameSchema
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await prismaService.user.findUnique({
              where: {
                email: value
              }
            })
            if (user === null) {
              throw new Error(MSG.EMAIL_NOT_FOUND)
            }
            const isvalid = await comparePassword(req.body.password, user.password)
            if (!isvalid) {
              throw new Error(MSG.EMAIL_OR_PASSWORD_INCORRECT)
            }
            ;(req as Request).user = user

            return true
          }
        }
      },
      password: passwordSchema
    },
    ['body']
  )
)


export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            try {
              if (!access_token) {
                throw new ErrorsWithStatus({
                  message: MSG.ACCESS_TOKEN_IS_REQUIRED,
                  status: HTTP_STATUS_CODE.UNAUTHORIZED
                })
              }
              const decode_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: CONFIG_ENV.JWT_ACCESS_TOKEN_SECRET_KEY
              })
              ;(req as Request).decode_authorization = decode_authorization
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorsWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS_CODE.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)