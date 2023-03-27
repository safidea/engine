import { PrismaClient } from '@prisma/client'

import { Db } from '../../types'

const prisma = new PrismaClient()

export default function db(tableName: string): Db {
  const table = prisma[tableName as keyof typeof prisma] as unknown as Db
  if (!table) {
    throw new Error(`Table ${tableName} does not exist`)
  }
  return table
}
