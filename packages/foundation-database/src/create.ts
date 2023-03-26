import debug from 'debug'

import db from './db'
import { Data } from '../types'

const log: debug.IDebugger = debug('db:create')

export async function create(tableName: string, data: Data): Promise<Data | null> {
  try {
    const result = await db(tableName).create({
      data,
    })
    log(`Created new row in ${tableName} with ID ${result.id}`)
    return result
  } catch (error) {
    log(`Error creating row in ${tableName}: ${error}`)
    return null
  }
}
