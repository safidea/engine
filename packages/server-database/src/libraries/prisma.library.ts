import { AppUtils } from 'server-common'
import PrismaUtils from '../utils/prisma.utils'

import type { PrismaClientInterface, PrismaClientsInterface } from '../interfaces/prisma.interface'
import type { PrismaClientType, PrismaClientsType } from '../types/prisma.type'

class PrismaLibrary {
  private clients: PrismaClientsType = {}

  constructor() {
    this.init()
  }

  public init(): void {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const PrismaClients = AppUtils.useLibrary('PrismaClients') as PrismaClientsInterface
    if (PrismaClients) {
      for (const baseName in PrismaClients) {
        const { PrismaClient } = PrismaClients[baseName]
        this.clients[baseName] = new PrismaClient()
      }
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

export default new PrismaLibrary()
