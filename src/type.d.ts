import { Request } from "express";
import { TokenPayLoad } from "./models/requests/user.request";
import { User } from "@prisma/client";


//Thêm các property tùy chỉnh vào Request của express
declare module 'express' {
  interface Request {
    user?: User
    decode_authorization?: TokenPayLoad
    decode_refresh_token?: TokenPayLoad
  }
}