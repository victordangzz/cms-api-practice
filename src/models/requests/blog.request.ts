import { Query, ParamsDictionary } from 'express-serve-static-core'

export interface Pagination extends Query {
  page?: string
  limit?: string
}
export interface CreateBlogReqBody {
  id: number
  title: string
  content: string
}

export interface UpdateBlogReqBody extends CreateBlogReqBody {}