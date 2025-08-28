import { NextFunction, Request, Response } from "express";
import { checkSchema, ParamSchema, validationResult } from "express-validator";
// import { validate} from "../utils/validation";
import MSG from "../constants/messages";
import userService from "../services/user.service";

// Simple validate function
const validate = (validation: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.mapped()
    })
  }
}

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
  checkSchema({
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
    name: nameSchema,
  }, ['body'])
)

