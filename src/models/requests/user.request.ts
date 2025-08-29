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
// Mấy phần khai báo này nên tận dụng kế thừa trong interface sẽ gọn hơn và đỡ phải viết nhiều lần (Đã sửa)

export interface UserLoginReqBody {
  email: string
  password: string
}

export interface CreateUserRequest extends UserLoginReqBody {
  name: string
}
export interface UserRegisterReqBody extends CreateUserRequest {
  confirmPassword: string
}
