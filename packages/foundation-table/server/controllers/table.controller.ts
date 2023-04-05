import debug from 'debug'
import { Database } from 'foundation-database/server'

import type { NextApiRequest, NextApiResponse } from 'foundation-common'
import type { Data } from 'foundation-database'

const log: debug.IDebugger = debug('table:controller')

export async function create(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const row = await Database(req.query.table).create(req.body as Data)
  log(`Created new row in ${req.query.table} with ID ${row.id}`)
  res.status(200).json(row)
}

export async function update(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const row = await Database(req.query.table).patchById(req.query.id, req.body as Data)
  log(`Updated row in ${req.query.table} with ID ${row.id}`)
  res.status(200).json(row)
}

export async function read(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const row = await Database(req.query.table).readById(req.query.id)
  log(`Got row in ${req.query.table} with ID ${row.id}`)
  res.status(200).json(row)
}

export async function list(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const rows = await Database(req.query.table).list()
  log(`Got all rows in ${req.query.table}`)
  res.status(200).json(rows)
}

export async function remove(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const row = await Database(req.query.table).deleteById(req.query.id)
  log(`Deleted row in ${req.query.table} with ID ${row.id}`)
  res.status(200).json(row)
}
