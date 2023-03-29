import { PrismaClient } from '@prisma/client'

import { Db } from '../../types'

const prisma = new PrismaClient()

export default function db(tableName: string): Db {
  return prisma[tableName as keyof typeof prisma] as unknown as Db
}
