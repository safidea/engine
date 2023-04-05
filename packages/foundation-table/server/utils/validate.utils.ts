import debug from 'debug'
import { ConfigService } from 'foundation-common/server'

import type { Tables, Data } from 'foundation-database'

const log: debug.IDebugger = debug('table:validate')

export default function validate(table: string, data: Data, allFields = false) {
  const tables = ConfigService.get('tables') as Tables
  const { fields } = tables[table]
  const errors = []

  for (const field of Object.keys(fields)) {
    const fieldData = fields[field]

    if (!allFields && !data[field]) {
      continue
    }

    if (!fieldData.optional && !fieldData.default && !data[field] && fieldData.type !== 'Boolean') {
      errors.push(`Field ${field} is required`)
    }

    if (fieldData.type === 'Int' && data[field] && !Number.isInteger(data[field])) {
      errors.push(`Field ${field} must be an integer`)
    }

    if (fieldData.type === 'String' && data[field] && typeof data[field] !== 'string') {
      errors.push(`Field ${field} must be a string`)
    }

    if (fieldData.type === 'DateTime' && data[field] && !new Date(String(data[field])).getTime()) {
      errors.push(`Field ${field} must be a valid date`)
    }

    if (fieldData.type === 'Boolean' && data[field] && typeof data[field] !== 'boolean') {
      errors.push(`Field ${field} must be a boolean`)
    }
  }

  if (errors.length > 0) log('Validation errors: %O', errors)

  return errors
}
