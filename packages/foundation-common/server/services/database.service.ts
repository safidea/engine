import PrismaService from './prisma.service'
import { Data, Row } from '../../types'

class DatabaseService {
  build(tables) {
    PrismaService.build(tables)
  }

  base(model: string) {
    return PrismaService.base(model)
  }

  async create(model: string, data: Data): Promise<Row> {
    const table = this.base(model)
    const row = await table.create({
      data,
    })
    return row
  }

  async patchById(model: string, id: string, data: Data): Promise<Row> {
    const table = this.base(model)
    const updated_at = new Date().toISOString()
    const row = await table.update({
      where: { id },
      data: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  async putById(model: string, id: string, data: Data): Promise<Row> {
    const table = this.base(model)
    const updated_at = new Date().toISOString()
    const row = await table.update({
      where: { id },
      data: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  async upsertById(model: string, id: string, data: Data): Promise<Row> {
    const table = this.base(model)
    const updated_at = new Date().toISOString()
    const row = await table.upsert({
      where: { id },
      create: data,
      update: {
        ...data,
        updated_at,
      },
    })
    return row
  }

  async readById(model: string, id: string): Promise<Row> {
    const table = this.base(model)
    const row = await table.findUnique({
      where: { id },
    })
    return row
  }

  async list(model: string): Promise<Row[]> {
    const table = this.base(model)
    const rows = await table.findMany({})
    return rows
  }

  async deleteById(model: string, id: string): Promise<Row> {
    const table = this.base(model)
    const deleted_at = new Date().toISOString()
    const row = await table.update({
      where: { id },
      data: {
        deleted_at,
      },
    })
    return row
  }
}

const service = new DatabaseService()

export default service
