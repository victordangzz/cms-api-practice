import { NextFunction, Request, Response } from "express";
import { checkSchema, ParamSchema, validationResult } from "express-validator";
// import { validate} from "../utils/validation";
import MSG from "../constants/messages";
import userService from "../services/user.service";

// Simple validate function
// Ngay chỗ này tại sao lại viết func validate chỗ này trong khi đây là 1 hàm dùng cho rất nhiều và rất nhiều req middleware mà em?
// Cái lỗi tiếp theo dùng any không phải là xấu như em đang cố ép nó để nó passing qua Typescript validate validation: any chỗ này có rất nhiều rủi ro nếu truyền sai sẽ ăn quả BUG ngay chỗ này
// Giải pháp nên tách hàm này ra một file utils/ nhen 
// Tiếp theo là ngay chỗ này validation: RunnableValidationChains<ValidationChain> nó sẽ có kiểu như thế này em nhen còn nếu e k rõ em có thể lên Typescript Sheet lần mò hoặc dùng stack overflow để check lại kiểu ngen hoặc sâu hơn thì em nên đọc cái docs của nó có nói về Validation Chain á em.
// cái tiếp theo là đường dẫn nên chú ý sao cho gọn nhất có thể chứ đừng có ../ hoặc ../../ hoặc ../../../ không hay và nhìn rất rối em nha
// Chỗ đường dẫn này a recommend em dùng cái allias path typescript để a đi làm lại a sẽ nói rõ chỗ này và nó chỉ là custom đường dẫn thôi.
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

