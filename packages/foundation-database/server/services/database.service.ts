import base from '../utils/base.utils'
import { Data, Row } from '../../types'

export default function DatabaseService(model: string) {
  const table = base(model)

  async function create(data: Data): Promise<Row> {
    const row = await table.create({
      data,
    })
    return row
  }

  async function patchById(id: string, data: Data): Promise<Row> {
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

  async function putById(id: string, data: Data): Promise<Row> {
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

  async function upsertById(id: string, data: Data): Promise<Row> {
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
    const deleted_at = new Date().toISOString()
    const row = await table.update({
      where: { id },
      data: {
        deleted_at,
      },
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
