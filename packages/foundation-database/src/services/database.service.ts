import base from '../utils/base.utils'
import { Data, Row } from '../../types'

export default function DatabaseService(tableName: string) {
  const table = base(tableName)

  async function create(data: Data): Promise<Row> {
    const row = await table.create({
      data,
    })
    return row
  }

  async function patchById(id: string, data: Row): Promise<Row> {
    const row = await table.update({
      where: { id },
      data,
    })
    return row
  }

  async function putById(id: string, data: Row): Promise<Row> {
    const row = await table.update({
      where: { id },
      data,
    })
    return row
  }

  async function upsertById(id: string, data: Data): Promise<Row> {
    const row = await table.upsert({
      where: { id },
      create: data,
      update: data,
    })
    return row
  }

  async function readById(id: string): Promise<Row> {
    const row = await table.findUnique({
      where: { id },
    })
    return row
  }

  async function list(): Promise<Row[]> {
    const rows = await table.findMany({})
    return rows
  }

  async function deleteById(id: string): Promise<Row> {
    const row = await table.delete({
      where: { id },
    })
    return row
  }

  return {
    create,
    patchById,
    putById,
    upsertById,
    readById,
    list,
    deleteById,
  }
}
