import { PrismaClient } from '@prisma/client'

class PrismaService extends PrismaClient {
  constructor() {
    super()
  }
  async connect() {
    await this.$connect()
    console.log('🟢 Prisma connected')
  }
  async disconnect() {
    await this.$disconnect()
    console.log('🔴 Prisma disconnected')
  }
}

const prismaService = new PrismaService()
export default prismaService
