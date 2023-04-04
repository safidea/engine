import { PrismaClient } from '../../generated/prisma/index.js'

import { Base } from '../../types'

export const prisma = new PrismaClient()

export default function base(tableName: string): Base {
  return prisma[tableName as keyof typeof prisma] as unknown as Base
}
