import { PrismaUtils } from '@database/server'
import PrismaClients from '../../../js/server/prisma'

import type { PrismaClientInterface } from '@database'

class PrismaLib {
  private clients = PrismaClients

  private model(baseName: string, modelName: string): PrismaClientInterface {
    const base = this.base(baseName)
    return base[modelName as keyof typeof base] as unknown as PrismaClientInterface
  }

  public table(baseName: string, tableName: string): PrismaClientInterface {
    const modelName = PrismaUtils.getModelName(tableName).toLowerCase()
    return this.model(baseName, modelName)
  }

  public base(baseName: string) {
    return this.clients[baseName as keyof typeof this.clients]
  }
}

export default new PrismaLib()
