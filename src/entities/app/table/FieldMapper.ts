import { Field } from '@entities/app/table/Field'
import { CurrencyField } from '@entities/app/table/fields/CurrencyField'
import { DatetimeField } from '@entities/app/table/fields/DatetimeField'
import { FormulaField } from '@entities/app/table/fields/FormulaField'
import { LongTextField } from '@entities/app/table/fields/LongTextField'
import { MultipleLinkedRecordsField } from '@entities/app/table/fields/MultipleLinkedRecordsField'
import { NumberField } from '@entities/app/table/fields/NumberField'
import { RollupField } from '@entities/app/table/fields/RollupField'
import { SingleLineTextField } from '@entities/app/table/fields/SingleLineTextField'
import { SingleLinkedRecordField } from '@entities/app/table/fields/SingleLinkedRecordField'
import { SingleSelectField } from '@entities/app/table/fields/SingleSelectField'
import { FieldDto } from '../dtos/FieldDto'
import { AutonumberField } from '@entities/app/table/fields/AutonumberField'
import { UrlField } from '@entities/app/table/fields/UrlField'

export class FieldMapper {
  static toEntity(fieldDto: FieldDto): Field {
    const { type } = fieldDto
    if (type === 'single_line_text') {
      return new SingleLineTextField(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? String(fieldDto.default) : undefined,
        fieldDto.permissions
      )
    }
    if (type === 'long_text') {
      return new LongTextField(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? String(fieldDto.default) : undefined
      )
    }
    if (type === 'number') {
      return new NumberField(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? Number(fieldDto.default) : undefined
      )
    }
    if (type === 'currency') {
      return new CurrencyField(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? Number(fieldDto.default) : undefined
      )
    }
    if (type === 'single_linked_record') {
      return new SingleLinkedRecordField(fieldDto.name, fieldDto.table, fieldDto.optional)
    }
    if (type === 'multiple_linked_records') {
      return new MultipleLinkedRecordsField(fieldDto.name, fieldDto.table, fieldDto.optional)
    }
    if (type === 'formula') {
      return new FormulaField(fieldDto.name, fieldDto.formula, fieldDto.format, fieldDto.optional)
    }
    if (type === 'rollup') {
      return new RollupField(
        fieldDto.name,
        fieldDto.linkedRecords,
        fieldDto.linkedField,
        fieldDto.formula,
        fieldDto.format,
        fieldDto.optional
      )
    }
    if (type === 'datetime') {
      return new DatetimeField(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? String(fieldDto.default) : undefined
      )
    }
    if (type === 'single_select') {
      return new SingleSelectField(
        fieldDto.name,
        fieldDto.options,
        fieldDto.optional,
        fieldDto.default
      )
    }
    if (type === 'autonumber') {
      return new AutonumberField(fieldDto.name)
    }
    if (type === 'url') {
      return new UrlField(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? String(fieldDto.default) : undefined
      )
    }
    throw new Error(`Invalid field type ${type}`)
  }

  static toDto(field: Field): FieldDto {
    if (field instanceof SingleLineTextField) {
      return {
        type: 'single_line_text',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof LongTextField) {
      return {
        type: 'long_text',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof NumberField) {
      return {
        type: 'number',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof CurrencyField) {
      return {
        type: 'currency',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof SingleLinkedRecordField) {
      return {
        type: 'single_linked_record',
        name: field.name,
        table: field.table,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof MultipleLinkedRecordsField) {
      return {
        type: 'multiple_linked_records',
        name: field.name,
        table: field.table,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof FormulaField) {
      return {
        type: 'formula',
        name: field.name,
        formula: field.formula,
        format: field.format,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof RollupField) {
      return {
        type: 'rollup',
        name: field.name,
        linkedRecords: field.linkedRecords,
        linkedField: field.linkedField,
        formula: field.formula,
        format: field.format,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof DatetimeField) {
      return {
        type: 'datetime',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof SingleSelectField) {
      return {
        type: 'single_select',
        name: field.name,
        options: field.options,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof AutonumberField) {
      return {
        type: 'autonumber',
        name: field.name,
      }
    }
    if (field instanceof UrlField) {
      return {
        type: 'url',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    throw new Error(`Invalid field instance ${field}`)
  }

  static toEntities(fieldsDto: FieldDto[]): Field[] {
    return fieldsDto.map((fieldDto) => this.toEntity(fieldDto))
  }

  static toDtos(fields: Field[]): FieldDto[] {
    return fields.map((field) => this.toDto(field))
  }
}
