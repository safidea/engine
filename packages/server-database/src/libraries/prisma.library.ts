import { PrismaClient } from '../../prisma/client'
import PrismaUtils from '../utils/prisma.utils'

import type { PrismaClientInterface } from '../interfaces/prisma.interface'

class PrismaLibrary {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  public table(tableName: string): PrismaClientInterface | undefined {
    const modelName = PrismaUtils.getModelName(tableName).toLowerCase()
    return this.prisma[modelName as keyof typeof this.prisma] as unknown as PrismaClientInterface
  }
}

export default new PrismaLibrary()
