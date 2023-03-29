import type { NextApiRequest, NextApiResponse, NextMiddleware } from 'foundation-utils'
import { Database, base } from 'foundation-database'

import validate from '../utils/validate.utils'

export async function validateTableExist(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) {
  const table = await base(req.query.table)
  if (!table) {
    return res.status(404).json({
      error: `Table ${req.query.table} does not exist`,
    })
  }
  return next()
}

export async function validateRowExist(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) {
  const row = await Database(req.query.table).readById(req.query.id)
  if (!row) {
    return res.status(404).json({
      error: `Row ${req.query.id} does not exist in table ${req.query.table}`,
    })
  }
  return next()
}

export async function validateBody(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) {
  if (!req.body) {
    return res.status(400).json({
      error: 'Body is required',
    })
  }
  return next()
}

export async function validateBodyFields(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) {
  const errors = validate(req.query.table, req.body)
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid body',
      details: errors,
    })
  }
  return next()
}

export async function validateBodyAllFields(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) {
  const errors = validate(req.query.table, req.body, true)
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid body',
      details: errors,
    })
  }
  return next()
}
