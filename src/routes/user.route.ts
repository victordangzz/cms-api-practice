import path from 'path'
import { Router, Request, Response, NextFunction } from 'express'
import { PREFIX_USER } from '../constants/path'
import {registerValidator} from "../middlewares/user.middleware"
// import { wrapRequestHandler } from '../utils/handler'
import { registerUser } from '../controllers/user.controller'

// Simple wrapper function
const wrapAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}

const userRouter = Router()

userRouter.post(`${PREFIX_USER}/register`,
  registerValidator,
  wrapAsync(registerUser)
)
export default userRouter