import ImportConfig from '@database/server/configs/import.config'
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
    const { PrismaClients } = ImportConfig()
    this.importClients(PrismaClients as PrismaClientsInterface)
  }

  private importClients(PrismaClients: PrismaClientsInterface): void {
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

  /** À n'utiliser que pour les tests */
  public async updateClients(pathToClientsFolder: string): Promise<void> {
    const { default: PrismaClients } = await import(pathToClientsFolder)
    this.importClients(PrismaClients as PrismaClientsInterface)
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
