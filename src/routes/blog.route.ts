import { updateBlogController } from '@/controllers/blog.controller'
import { PREFIX_BLOG } from '@/constants/path'
import { Router, Request, Response, NextFunction } from 'express'
import { createBlogValidator, deleteBlogValidator, updateBlogValidator } from '@/middlewares/blog.middleware'
import { wrapRequestHandler } from '@/utils/handler'
import { createBlogController } from '@/controllers/blog.controller'
import { accessTokenValidator } from '@/middlewares/user.middleware'
import { deleteBlogController } from '@/controllers/blog.controller'
import { getListBlogWithPagination } from '@/controllers/blog.controller'
const router = Router()

/**
 * Description: Create Blog
 * Path: /create
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { title: string, content: string }
 * */
router.post(
  `${PREFIX_BLOG}/create`,
  accessTokenValidator,
  createBlogValidator,
  wrapRequestHandler(createBlogController)
)

/**
 * Description: Update Blog
 * Path: /update
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { title: string, content: string }
 * */
router.put(
  `${PREFIX_BLOG}/update/:id`,
  accessTokenValidator,
  createBlogValidator,
  updateBlogValidator,
  wrapRequestHandler(updateBlogController)
)

/**
 * Description: Delete Blog
 * Path: /delete
 * Method: POST
 * Request header: { Authorization: Bearer <access_token> }
 * Request body: { id: number }
 * */
router.delete(
  `${PREFIX_BLOG}/delete/:id`,
  accessTokenValidator,
  deleteBlogValidator,
  wrapRequestHandler(deleteBlogController)
)

/**
 * Description: Get List Blog
 * Path: /list
 * Method: GET
 * Request header: { Authorization: Bearer <access_token> }
 * */
router.get(`${PREFIX_BLOG}/list`, accessTokenValidator, wrapRequestHandler(getListBlogWithPagination))

export default router
