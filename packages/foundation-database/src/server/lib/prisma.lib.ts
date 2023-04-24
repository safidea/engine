import { PrismaUtils } from '@database/server'
import PrismaClients from '../../../js/server/prisma'

import type { DataType, RowType } from '@database'

interface BaseInterface {
  create: (params: { data: DataType }) => Promise<RowType>
  update: (params: { data: DataType; where: DataType }) => Promise<RowType>
  upsert: (params: { create: DataType; update: DataType; where: DataType }) => Promise<RowType>
  findUnique: (params: { where: DataType }) => Promise<RowType>
  findMany: (params: { where?: DataType }) => Promise<RowType[]>
  delete: (params: { where: DataType }) => Promise<RowType>
}

class PrismaLib {
  private clients = PrismaClients

  private model(baseName: string, modelName: string): BaseInterface {
    const instance = this.instance(baseName)
    return instance[modelName as keyof typeof instance] as unknown as BaseInterface
  }

  public base(tablePath: string): BaseInterface {
    const [baseName, tableName] = tablePath.split('.')
    const modelName = PrismaUtils.getModelName(tableName).toLowerCase()
    return this.model(baseName, modelName)
  }

  public instance(baseName: string) {
    return this.clients[baseName as keyof typeof this.clients]
  }
}

export default new PrismaLib()
