import { PrismaClients } from '@database/server/configs/import.config'
import PrismaUtils from '@database/server/utils/prisma.utils'

import type { PrismaClientInterface } from '@database'

type PrismaClientType = { [key: string]: PrismaClientInterface }
type PrismaClientsType = { [key: string]: PrismaClientType }

class PrismaLib {
  private clients: PrismaClientsType = {}

  constructor() {
    for (const baseName in PrismaClients) {
      const { PrismaClient } = PrismaClients[baseName as keyof typeof PrismaClients] as unknown as {
        PrismaClient: new () => PrismaClientType
      }
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
