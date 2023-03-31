import { ConfigService } from 'foundation-common'

import type { Config, Data } from 'foundation-database'

export default async function validate(table: string, data: Data, allFields = false) {
  const { tables } = (await ConfigService.get()) as Config
  const modelData = tables[table]
  const fields = Object.keys(modelData)
  const errors = []

  for (const field of fields) {
    const fieldData = modelData[field]

    if (!allFields && !data[field]) {
      continue
    }

    if (!fieldData.nullable && !fieldData.default && !data[field]) {
      errors.push(`Field ${field} is required`)
    }

    if (fieldData.type === 'integer' && data[field] && !Number.isInteger(data[field])) {
      errors.push(`Field ${field} must be an integer`)
    }

    if (fieldData.type === 'string' && data[field] && typeof data[field] !== 'string') {
      errors.push(`Field ${field} must be a string`)
    }

    if (fieldData.type === 'datetime' && data[field] && !new Date(String(data[field])).getTime()) {
      errors.push(`Field ${field} must be a valid date`)
    }

    if (fieldData.type === 'boolean' && data[field] && typeof data[field] !== 'boolean') {
      errors.push(`Field ${field} must be a boolean`)
    }
  }

  return errors
}
