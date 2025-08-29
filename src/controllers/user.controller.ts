import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { UserLoginReqBody, UserRegisterReqBody } from '@/models/requests/user.request'
import { User } from '@prisma/client'
import userService from '@/services/user.service'
import HTTP_STATUS_CODE from '@/constants/httpStatusCode'
import MSG from '@/constants/messages'

export const registerUser = async (req: Request<ParamsDictionary, any, UserRegisterReqBody>, res: Response) => {
  const payload = req.body
  const result = await userService.register(payload)
  res.status(HTTP_STATUS_CODE.OK).json(result)

  return
}

export const loginController = async (req: Request<ParamsDictionary, any, UserLoginReqBody>, res: Response) => {
  const user = req.user as User
  const result = await userService.login({ user_id: user.id, verify: user.verifyStatus })
  res.json({
    message: MSG.LOGIN_SUCCESS,
    data: result
  })
  return
}
