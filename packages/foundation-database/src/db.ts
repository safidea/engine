import { PrismaClient } from '@prisma/client'

import { Base } from '../types'

const prisma = new PrismaClient()

export default function db(tableName: string): Base {
  const table = prisma[tableName as keyof typeof prisma] as unknown as Base
  if (!table) {
    throw new Error(`Table ${tableName} does not exist`)
  }
  return table
}
