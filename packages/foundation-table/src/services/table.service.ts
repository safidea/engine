import db from '../utils/db.utils'
import { Data, Row } from '../../types'

export async function create(tableName: string, data: Data): Promise<Row> {
  const row = await db(tableName).create({
    data,
  })
  return row
}

export async function update(tableName: string, data: Row): Promise<Row> {
  const { id, ...rest } = data
  const row = await db(tableName).update({
    where: { id },
    data: rest,
  })
  return row
}

export async function getById(tableName: string, id: number): Promise<Row> {
  const row = await db(tableName).findUnique({
    where: { id },
  })
  return row
}

export async function getAll(tableName: string): Promise<Row[]> {
  const rows = await db(tableName).findMany({})
  return rows
}

export async function removeById(tableName: string, id: number): Promise<Row> {
  const row = await db(tableName).delete({
    where: { id },
  })
  return row
}
