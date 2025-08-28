import { JwtPayload } from 'jsonwebtoken'
import { UserVerifyStatus } from '@prisma/client'
import { TokenType } from '@/constants/enum'

export interface TokenPayLoad extends JwtPayload {
  user_id: number
  token_type: TokenType
  verify: UserVerifyStatus
  iat: number
  exp: number
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
}
export interface UserRegisterReqBody extends CreateUserRequest {
  confirmPassword: string
}
export interface UserLoginReqBody {
  email: string
  password: string
}
