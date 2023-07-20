import { FieldDto } from '@application/dtos/FieldDto'
import { Field } from '@domain/entities/Field'
import { Currency } from '@domain/entities/fields/Currency'
import { Formula } from '@domain/entities/fields/Formula'
import { LongText } from '@domain/entities/fields/LongText'
import { MultipleLinkedRecords } from '@domain/entities/fields/MultipleLinkedRecords'
import { NumberField } from '@domain/entities/fields/NumberField'
import { Rollup } from '@domain/entities/fields/Rollup'
import { SingleLineText } from '@domain/entities/fields/SingleLineText'
import { SingleLinkRecord } from '@domain/entities/fields/SingleLinkedRecord'

export function mapDtoToField(fieldDto: FieldDto): Field {
  const { type } = fieldDto
  if (type === 'single_line_text') {
    return new SingleLineText(fieldDto.name, fieldDto.optional)
  }
  if (type === 'long_text') {
    return new LongText(fieldDto.name, fieldDto.optional)
  }
  if (type === 'number') {
    return new NumberField(fieldDto.name, fieldDto.optional)
  }
  if (type === 'currency') {
    return new Currency(fieldDto.name, fieldDto.optional)
  }
  if (type === 'single_linked_record') {
    return new SingleLinkRecord(fieldDto.name, fieldDto.table, fieldDto.optional)
  }
  if (type === 'multiple_linked_records') {
    return new MultipleLinkedRecords(fieldDto.name, fieldDto.table, fieldDto.optional)
  }
  if (type === 'formula') {
    return new Formula(fieldDto.name, fieldDto.formula, fieldDto.format, fieldDto.optional)
  }
  if (type === 'rollup') {
    return new Rollup(
      fieldDto.name,
      fieldDto.linked_records,
      fieldDto.linked_field,
      fieldDto.formula,
      fieldDto.format,
      fieldDto.optional
    )
  }
  throw new Error(`Invalid field type ${type}`)
}
