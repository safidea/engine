import { Field } from '@domain/entities/table/Field'
import { Currency } from '@domain/entities/table/fields/Currency'
import { Datetime } from '@domain/entities/table/fields/Datetime'
import { Formula } from '@domain/entities/table/fields/Formula'
import { LongText } from '@domain/entities/table/fields/LongText'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'
import { NumberField } from '@domain/entities/table/fields/NumberField'
import { Rollup } from '@domain/entities/table/fields/Rollup'
import { SingleLineText } from '@domain/entities/table/fields/SingleLineText'
import { SingleLinkRecord } from '@domain/entities/table/fields/SingleLinkedRecord'
import { SingleSelect } from '@domain/entities/table/fields/SingleSelect'
import { FieldDto } from '../dtos/FieldDto'

export class FieldMapper {
  static toEntity(fieldDto: FieldDto): Field {
    const { type } = fieldDto
    if (type === 'single_line_text') {
      return new SingleLineText(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? String(fieldDto.default) : undefined
      )
    }
    if (type === 'long_text') {
      return new LongText(
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
      return new Currency(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? Number(fieldDto.default) : undefined
      )
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
        fieldDto.linkedRecords,
        fieldDto.linkedField,
        fieldDto.formula,
        fieldDto.format,
        fieldDto.optional
      )
    }
    if (type === 'datetime') {
      return new Datetime(
        fieldDto.name,
        fieldDto.optional,
        fieldDto.default ? String(fieldDto.default) : undefined
      )
    }
    if (type === 'single_select') {
      return new SingleSelect(fieldDto.name, fieldDto.options, fieldDto.optional, fieldDto.default)
    }
    throw new Error(`Invalid field type ${type}`)
  }

  static toDto(field: Field): FieldDto {
    if (field instanceof SingleLineText) {
      return {
        type: 'single_line_text',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof LongText) {
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
    if (field instanceof Currency) {
      return {
        type: 'currency',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof SingleLinkRecord) {
      return {
        type: 'single_linked_record',
        name: field.name,
        table: field.table,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof MultipleLinkedRecords) {
      return {
        type: 'multiple_linked_records',
        name: field.name,
        table: field.table,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof Formula) {
      return {
        type: 'formula',
        name: field.name,
        formula: field.formula,
        format: field.format,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof Rollup) {
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
    if (field instanceof Datetime) {
      return {
        type: 'datetime',
        name: field.name,
        optional: field.optional,
        default: field.default,
      }
    }
    if (field instanceof SingleSelect) {
      return {
        type: 'single_select',
        name: field.name,
        options: field.options,
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
