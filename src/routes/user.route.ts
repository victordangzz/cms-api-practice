import path from 'path'
import { Router, Request, Response, NextFunction } from 'express'
import { PREFIX_USER } from '@/constants/path'
import { loginValidator, registerValidator } from '@/middlewares/user.middleware'
import { wrapRequestHandler } from '@/utils/handler'
import { loginController, registerUser } from '@/controllers/user.controller'

const userRouter = Router()
/**
 * Description: Register User
 * Path: /register
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { email: string, password: string, name: string }
 * */
userRouter.post(`${PREFIX_USER}/register`, registerValidator, wrapRequestHandler(registerUser))

/**
 * Description: Login User
 * Path: /login
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { email: string, password: string }
 * */
userRouter.post(`${PREFIX_USER}/login`, loginValidator, wrapRequestHandler(loginController))
export default userRouter
