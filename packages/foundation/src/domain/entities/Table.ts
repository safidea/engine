import { FieldCurrency } from './FieldCurrency'
import { FieldFormula } from './FieldFormula'
import { FieldLongText } from './FieldLongText'
import { FieldMultipleLinkedRecord } from './FieldMultipleLinkedRecord'
import { FieldNumber } from './FieldNumber'
import { FieldRollup } from './FieldRollup'
import { FieldSingleLineText } from './FieldSingleLineText'
import { FieldSingleLinkRecord } from './FieldSingleLinkedRecord'

export class Table {
  public name: string
  public fields: (
    | FieldFormula
    | FieldMultipleLinkedRecord
    | FieldSingleLinkRecord
    | FieldRollup
    | FieldSingleLineText
    | FieldLongText
    | FieldNumber
    | FieldCurrency
  )[]

  constructor(schema: Table) {
    this.name = schema.name
    this.fields = schema.fields.map((field) => {
      switch (field.type) {
        case 'single_line_text':
          return new FieldSingleLineText(field)
        case 'long_text':
          return new FieldLongText(field)
        case 'number':
          return new FieldNumber(field)
        case 'currency':
          return new FieldCurrency(field)
        case 'formula':
          return new FieldFormula(field as FieldFormula)
        case 'rollup':
          return new FieldRollup(field as FieldRollup)
        case 'multiple_linked_records':
          return new FieldMultipleLinkedRecord(field as FieldMultipleLinkedRecord)
        case 'single_linked_record':
          return new FieldSingleLinkRecord(field as FieldSingleLinkRecord)
        default:
          throw new Error(`Unknown field type: ${field.type}`)
      }
    })
  }
}
