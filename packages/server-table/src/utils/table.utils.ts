import { ConfigUtils } from 'server-common'

import type { TableFieldsInterface, TablesInterface } from 'shared-table'
import type { DatabaseDataType } from 'shared-database'

class TableUtils {
  public getDefaultFields(): TableFieldsInterface {
    return {
      id: {
        type: 'String',
        primary: true,
        default: 'cuid()',
      },
      created_at: {
        type: 'DateTime',
        default: 'now()',
      },
      updated_at: {
        type: 'DateTime',
        optional: true,
      },
      deleted_at: {
        type: 'DateTime',
        optional: true,
      },
    }
  }

  public validateDataFields(
    table: string,
    data: DatabaseDataType = {},
    action = 'CREATE'
  ): string[] {
    const tables = ConfigUtils.get('tables') as TablesInterface
    const { fields = {} } = tables[table]
    const errors = []

    const values = { ...data }

    for (const field of Object.keys(fields)) {
      const fieldData = fields[field]
      const value = values[field]
      delete values[field]

      if (!value && (action === 'UPDATE' || fieldData.optional || fieldData.default)) {
        continue
      }

      if (!fieldData.optional && !fieldData.default && !value && fieldData.type !== 'Boolean') {
        errors.push(`Field ${field} is required`)
      }

      if (fieldData.type === 'Int' && value && !Number.isInteger(value)) {
        errors.push(`Field ${field} must be an integer`)
      }

      if (fieldData.type === 'String' && value && typeof value !== 'string') {
        errors.push(`Field ${field} must be a string`)
      }

      if (fieldData.type === 'DateTime' && value && !new Date(String(value)).getTime()) {
        errors.push(`Field ${field} must be a valid date`)
      }

      if (fieldData.type === 'Boolean' && value && typeof value !== 'boolean') {
        errors.push(`Field ${field} must be a boolean`)
      }
    }

    if (Object.keys(values).length > 0) {
      errors.push(`Invalid fields: ${Object.keys(values).join(', ')}`)
    }

    return errors
  }
}

export default new TableUtils()
