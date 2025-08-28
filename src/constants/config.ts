import { config } from 'dotenv'
import argv from 'minimist'
import type { StringValue } from 'ms'

config()
const options = argv(process.argv.slice(2))

export const isProduction = options.production === true

export const CONFIG_ENV = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  STATUS: isProduction ? 'production' : 'development',
  PASSWORD_SECRET: process.env.PASSWORD_SECRET,
  JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY as StringValue,
  JWT_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY as StringValue,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as StringValue,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as StringValue
}
