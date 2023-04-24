import { PrismaLib } from '@database/server'
import type { DataType, RowType } from '@database'

class DatabaseService {
  async create(tablePath: string, data: DataType): Promise<RowType> {
    const row = await PrismaLib.base(tablePath).create({
      data,
    })
    return row
  }

  async patchById(tablePath: string, id: string, data: DataType): Promise<RowType> {
    const updated_at = new Date().toISOString()
    const row = await PrismaLib.base(tablePath).update({
      where: { id },
      data: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  async putById(tablePath: string, id: string, data: DataType): Promise<RowType> {
    const updated_at = new Date().toISOString()
    const row = await PrismaLib.base(tablePath).update({
      where: { id },
      data: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  async upsertById(tablePath: string, id: string, data: DataType): Promise<RowType> {
    const updated_at = new Date().toISOString()
    const row = await PrismaLib.base(tablePath).upsert({
      where: { id },
      create: data,
      update: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  async readById(tablePath: string, id: string): Promise<RowType> {
    const row = await PrismaLib.base(tablePath).findUnique({
      where: { id },
    })
    return row
  }

  async list(tablePath: string): Promise<RowType[]> {
    const rows = await PrismaLib.base(tablePath).findMany({})
    return rows
  }

  async deleteById(tablePath: string, id: string): Promise<RowType> {
    const deleted_at = new Date().toISOString()
    const row = await PrismaLib.base(tablePath).update({
      where: { id },
      data: {
        deleted_at,
      },
    })
    return row
  }
}

export default new DatabaseService()
