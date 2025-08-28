import { UserLoginReqBody } from './../models/requests/user.request'
import { CONFIG_ENV } from '../constants/config'
import { TokenType } from '../constants/enum'
import { UserRegisterReqBody } from '../models/requests/user.request'
import prismaService from './prisma.service'
import omit from 'lodash/omit'
import MSG from '../constants/messages'
import { sign } from 'crypto'
import { signToken, verifyToken } from '@/utils/jwt'
import { UserVerifyStatus } from '@prisma/client'
import { convertToSeconds } from '@/utils/common'
import { hashPassword } from '@/utils/crypto'
// Những chỗ này thì không có gì phải sửa
// Nhưng có 1 số kiến thức a nghĩ là em nên note lại để ôn lại tí xíu
// phân phân rả 1 object hoặc là lưu lại object như thế nào và lưu array như thế nào cái này a sẽ cùng cấp tài liệu trên nhóm của mình em nha. Nó là mảng và object
interface SignAccessTokenServicePayload {
  user_id: number
  verify: UserVerifyStatus
}
interface SignRefreshTokenSerevicePayload extends Pick<SignAccessTokenServicePayload, 'user_id' | 'verify'> {
  exp?: number
}

interface SignAccessTokenAndRefreshTokenSerevicePayload
  extends Pick<SignAccessTokenServicePayload, 'user_id' | 'verify'> {}

interface LoginServicePayload extends Pick<SignAccessTokenServicePayload, 'user_id' | 'verify'> {}

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
  private signRefreshToken({ user_id, verify, exp }: SignRefreshTokenSerevicePayload) {
    if (exp) {
      return signToken({
        payload: { user_id, token_type: TokenType.RefreshToken, verify },
        privateKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY
      })
    }

    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken, verify },
      privateKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY,
      options: {
        expiresIn: CONFIG_ENV.JWT_REFRESH_TOKEN_EXPIRES_IN
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
  async register(payload: UserRegisterReqBody) {
    const _payload = {
      ...payload
    }
    const userPayload = omit(_payload, ['confirmPassword'])

    const user = await prismaService.user.create({
      data: {
        ...userPayload,
        verifyStatus: 'Verified', // Khi đưa vào dự án thực tế thì để mặc định Unverified, đang test nên để như vậy
        password: await hashPassword(_payload.password)
      }
    })
    return {
      message: MSG.REGISTER_SUCCESS
    }
  }
  private signAccessTokenRefreshToken({ user_id, verify }: SignAccessTokenAndRefreshTokenSerevicePayload) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: CONFIG_ENV.JWT_REFRESH_TOKEN_SECRET_KEY
    })
  }

  async login({ user_id, verify }: LoginServicePayload) {
    const [access_token, refresh_token] = await this.signAccessTokenRefreshToken({
      user_id,
      verify
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    const [user] = await Promise.all([
      prismaService.user.findUnique({
        where: {
          id: user_id
        },
        select: {
          id: true,
          email: true,
          name: true
        }
      }),
      prismaService.refreshToken.create({
        data: {
          token: refresh_token,
          user_id,
          iat: new Date(iat * 1000),
          exp: new Date(exp * 1000)
        }
      })
    ])

    const expires_access_token = convertToSeconds(CONFIG_ENV.JWT_ACCESS_TOKEN_EXPIRES_IN)
    const expires_refresh_token = convertToSeconds(CONFIG_ENV.JWT_REFRESH_TOKEN_EXPIRES_IN)
    return {
      access_token,
      refresh_token,
      expires_access_token,
      expires_refresh_token,
      user
    }
  }
}

const userService = new UserService()
export default userService
