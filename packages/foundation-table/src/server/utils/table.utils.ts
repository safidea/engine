import { ConfigUtils } from '@common/server'

import type { TableFieldsInterface, TablesInterface } from '@table'
import type { DatabaseDataType } from '@database'

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

  public validateDataFields(table: string, data: DatabaseDataType, allFields = false): string[] {
    const tables = ConfigUtils.get('tables') as TablesInterface
    const { fields } = tables[table]
    const errors = []

    for (const field of Object.keys(fields)) {
      const fieldData = fields[field]

      if (!allFields && !data[field] && (fieldData.optional || fieldData.default)) {
        continue
      }

      if (
        !fieldData.optional &&
        !fieldData.default &&
        !data[field] &&
        fieldData.type !== 'Boolean'
      ) {
        errors.push(`Field ${field} is required`)
      }

      if (fieldData.type === 'Int' && data[field] && !Number.isInteger(data[field])) {
        errors.push(`Field ${field} must be an integer`)
      }

      if (fieldData.type === 'String' && data[field] && typeof data[field] !== 'string') {
        errors.push(`Field ${field} must be a string`)
      }

      if (
        fieldData.type === 'DateTime' &&
        data[field] &&
        !new Date(String(data[field])).getTime()
      ) {
        errors.push(`Field ${field} must be a valid date`)
      }

      if (fieldData.type === 'Boolean' && data[field] && typeof data[field] !== 'boolean') {
        errors.push(`Field ${field} must be a boolean`)
      }
    }

    return errors
  }
}

export default new TableUtils()
