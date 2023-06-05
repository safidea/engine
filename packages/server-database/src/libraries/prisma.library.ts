import { PrismaClient } from '../../prisma/client'
import PrismaUtils from '../utils/prisma.utils'

import type { PrismaClientInterface } from '../interfaces/prisma.interface'

class PrismaLibrary {
  private client: PrismaClient

  constructor() {
    this.client = new PrismaClient()
  }

  public table(tableName: string): PrismaClientInterface | undefined {
    const modelName = PrismaUtils.getModelName(tableName).toLowerCase()
    return this.client[modelName as keyof typeof this.client] as unknown as PrismaClientInterface
  }
}

export default new PrismaLibrary()
