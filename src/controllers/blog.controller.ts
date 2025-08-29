import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import prisma from '@/services/prisma.service'
import { TokenPayLoad } from '@/models/requests/user.request'
import { ErrorsWithStatus } from '@/models/Errors'
import HTTP_STATUS_CODE from '@/constants/httpStatusCode'
import { CreateBlogReqBody } from '@/models/requests/blog.request'
import blogService from '@/services/blog.service'
import MSG from '@/constants/messages'

// chưa xoá log

export const createBlogController = async (req: Request<ParamsDictionary, any, CreateBlogReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const payload = req.body
  const result = await blogService.createBlogService({ payload, user_id })
  res.status(HTTP_STATUS_CODE.OK).json(result)
}

export const updateBlogController = async (req: Request<ParamsDictionary, any, CreateBlogReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const payload = req.body
  console.log(payload)
  const result = await blogService.updateBlogService({ payload, user_id })
  console.log(result)
  res.status(HTTP_STATUS_CODE.OK).json(result)
}
export const deleteBlogController = async (req: Request<ParamsDictionary, any, { id: number }>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayLoad
  const { id } = req.body
  const result = await blogService.deleteBlogService({ id, user_id })
  res.status(HTTP_STATUS_CODE.OK).json(result)
}

export const getListBlogWithPagination = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const payload = req.query
  const { user_id } = req.decode_authorization as TokenPayLoad
  const { blogs, totalBlogs, limit, page } = await blogService.listWithPaginationService(payload)
  const totalPages = Math.ceil(totalBlogs / limit)
  res.json({
    message: MSG.GET_LIST_BLOG_SUCCESS,
    data: {
      blogs,
      page,
      limit,
      totalPages
    }
  })
}
