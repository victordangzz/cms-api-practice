import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterUserRequest } from '../models/requests/user.request'
import { User } from '@prisma/client'
import userService from '../services/user.service'
import HTTP_STATUS_CODE from '../constants/httpStatusCode'

export const registerUser = async (req: Request<ParamsDictionary, any, RegisterUserRequest>, res: Response) => {
  const payload = req.body
  const result = await userService.register(payload)
  res.status(HTTP_STATUS_CODE.OK).json(result)
 
  return
}
