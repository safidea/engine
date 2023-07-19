import { AppDto } from '@application/dtos/AppDto'
import { App } from '@domain/entities/App'
import { FieldCurrency } from '@domain/entities/FieldCurrency'
import { FieldFormula } from '@domain/entities/FieldFormula'
import { FieldLongText } from '@domain/entities/FieldLongText'
import { FieldMultipleLinkedRecord } from '@domain/entities/FieldMultipleLinkedRecord'
import { FieldNumber } from '@domain/entities/FieldNumber'
import { FieldRollup } from '@domain/entities/FieldRollup'
import { FieldSingleLineText } from '@domain/entities/FieldSingleLineText'
import { FieldSingleLinkRecord } from '@domain/entities/FieldSingleLinkedRecord'

export function mapDtoToApp(schema: AppDto): App {
  return {
    name: schema.name ?? 'My new app',
    version: schema.version ?? '0.0.0',
    pages: schema.pages ?? [],
    tables: schema.tables ?? [],
  }
}

export function mapAppToDto(app: App): AppDto {
  return {
    name: app.name,
    version: app.version,
    pages: app.pages,
    tables: app.tables.map((table) => ({
      name: table.name,
      fields: table.fields.map((field) => {
        const type = field.type
        const common = {
          name: field.name,
          optional: field.optional,
        }
        if (field instanceof FieldFormula)
          return {
            ...common,
            type: 'formula',
            formula: field.formula,
          }
        if (field instanceof FieldMultipleLinkedRecord)
          return {
            ...common,
            type: 'multiple_linked_records',
            table: field.table,
          }
        if (field instanceof FieldSingleLinkRecord)
          return {
            ...common,
            type: 'single_linked_record',
            table: field.table,
          }
        if (field instanceof FieldRollup)
          return {
            ...common,
            type: 'rollup',
            linked_records: field.linked_records,
            linked_field: field.linked_field,
            formula: field.formula,
          }
        if (field instanceof FieldSingleLineText)
          return {
            ...common,
            type: 'single_line_text',
          }
        if (field instanceof FieldLongText)
          return {
            ...common,
            type: 'long_text',
          }
        if (field instanceof FieldNumber)
          return {
            ...common,
            type: 'number',
          }
        if (field instanceof FieldCurrency)
          return {
            ...common,
            type: 'currency',
          }
        throw new Error(`Unknown field type: ${type}`)
      }),
    })),
  }
}
