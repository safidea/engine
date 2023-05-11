import AppUtils from '@common/server/utils/app.utils'
import PrismaUtils from '@database/server/utils/prisma.utils'

import type {
  PrismaClientInterface,
  PrismaClientsInterface,
  PrismaClientType,
  PrismaClientsType,
} from '@database'

class PrismaLib {
  private clients: PrismaClientsType = {}

  constructor() {
    const PrismaClients = AppUtils.importLib('PrismaClients') as PrismaClientsInterface
    for (const baseName in PrismaClients) {
      const { PrismaClient } = PrismaClients[baseName]
      this.clients[baseName] = new PrismaClient()
    }
  }

  private model(baseName: string, modelName: string): PrismaClientInterface | undefined {
    const base = this.base(baseName)
    if (!base) return undefined
    return base[modelName]
  }

  public base(baseName: string): PrismaClientType | undefined {
    return this.clients[baseName]
  }

  public table(baseName: string, tableName: string): PrismaClientInterface | undefined {
    const modelName = PrismaUtils.getModelName(tableName).toLowerCase()
    return this.model(baseName, modelName)
  }
}

export default new PrismaLib()
