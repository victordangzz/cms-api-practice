import { Pagination, UpdateBlogReqBody } from '@/models/requests/blog.request'
import { CreateBlogReqBody } from '@/models/requests/blog.request'
import prismaService from './prisma.service'
import MSG from '@/constants/messages'
import { update } from 'lodash'
import { LIMIT, PAGE } from '@/constants/pagination'
import { filterPayload } from '@/utils/common'
interface CreateBlogServicePayload {
  payload: CreateBlogReqBody
  user_id: number
}
interface UpdateBlogServicePayload {
  payload: UpdateBlogReqBody
  user_id: number
}
class BlogService {
  async createBlogService({ payload, user_id }: CreateBlogServicePayload) {
    await prismaService.blog.create({
      data: {
        ...payload,
        authorId: user_id
      }
    })
    return {
      message: MSG.CREATE_ACTIVITY_SUCCESS
    }
  }
  async isBlogExist({ id }: { id: number }) {
    const blog = await prismaService.blog.findUnique({
      where: {
        id
      }
    })
    return Boolean(blog)
  }
  async updateBlogService({ payload, user_id }: UpdateBlogServicePayload, id_blog: number) {
    const filteredPayload = filterPayload(payload)
    const _payload = {
      ...filteredPayload,
      updatedAt: new Date()
    }
    await prismaService.blog.update({
      where: {
        id: id_blog,
        authorId: user_id
      },
      data: {
        ..._payload
      }
    })
    return {
      message: MSG.UPDATE_ACTIVITY_SUCCESS
    }
  }
  async deleteBlogService(payload: { id: number; user_id: number }) {
    console.log('payload:', payload)
    await prismaService.blog.delete({
      where: {
        id: payload.id,
        authorId: payload.user_id
      }
    })
    return {
      message: MSG.DELETE_ACTIVITY_SUCCESS
    }
  }
  async listWithPaginationService(payload: Pagination) {
    const page = Number(payload?.page) || PAGE //chỗ Pagination nếu user truyền vào thì sẽ lấy giá trị này
    const limit = Number(payload?.limit) || LIMIT
    prismaService.blog.findMany({
      skip: (page - 1) * limit,
      take: limit
    })
    const [blogs, totalBlogs] = await Promise.all([
      prismaService.blog.findMany({
        skip: (page - 1) * limit,
        take: limit
      }),
      prismaService.blog.count()
    ])

    return {
      blogs,
      totalBlogs,
      page,
      limit
    }
  }
}

const blogService = new BlogService()
export default blogService
