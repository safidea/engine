import db from '../utils/db.utils'
import { Data } from '../../types'

export async function create(tableName: string, data: Data): Promise<Data> {
  const row = await db(tableName).create({
    data,
  })
  return row
}

export async function update(tableName: string, data: Data): Promise<Data> {
  const { id, ...rest } = data
  const row = await db(tableName).update({
    where: { id },
    data: rest,
  })
  return row
}
