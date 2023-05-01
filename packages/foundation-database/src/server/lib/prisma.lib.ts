import { PrismaUtils } from '@database/server'

import type { PrismaClientInterface } from '@database'

type PrismaClientType = { [key: string]: PrismaClientInterface }
type PrismaClientsType = { [key: string]: PrismaClientType }

class PrismaLib {
  private clients: PrismaClientsType = {}

  public async init(pathToClients: string): Promise<void> {
    const { default: clients } = await import(pathToClients)
    for (const baseName in clients) {
      const { PrismaClient } = clients[baseName as keyof typeof clients]
      this.clients[baseName] = new PrismaClient() as unknown as PrismaClientType
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
