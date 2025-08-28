import { LoginUserRequest } from './../models/requests/user.request'
import { CONFIG_ENV } from '../constants/config'
import { TokenType } from '../constants/enum'
import { RegisterUserRequest } from '../models/requests/user.request'
import prismaService from './prisma.service'
import omit from 'lodash/omit'
import MSG from '../constants/messages'
import { sign } from 'crypto'
import { signToken } from '@/utils/jwt'
// Những chỗ này thì không có gì phải sửa
// Nhưng có 1 số kiến thức a nghĩ là em nên note lại để ôn lại tí xíu
// phân phân rả 1 object hoặc là lưu lại object như thế nào và lưu array như thế nào cái này a sẽ cùng cấp tài liệu trên nhóm của mình em nha. Nó là mảng và object
interface SignAccessTokenServicePayload {
  user_id: string
}

class UserService {
  private signAccessToken({ user_id }: SignAccessTokenServicePayload) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      privateKey: CONFIG_ENV.JWT_ACCESS_TOKEN_SECRET_KEY,
      options: {
        expiresIn: CONFIG_ENV.JWT_ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  async isExistUser(email: string) {
    const user = await prismaService.user.findUnique({
      where: {
        email
      }
    })
    return Boolean(user)
  }
  async register(payload: RegisterUserRequest) {
    const _payload = {
      ...payload
    }
    const userPayload = omit(_payload, ['confirmPassword'])

    const user = await prismaService.user.create({
      data: userPayload
    })
    return {
      message: MSG.REGISTER_SUCCESS
    }
  }
  async login(payload: LoginUserRequest) {
    const user = await prismaService.user.findUnique({
      where: {
        email: payload.email
      }
    })
    if (!user) {
      throw new Error(MSG.USER_NOT_FOUND)
    }
  }
}

const userService = new UserService()
export default userService
