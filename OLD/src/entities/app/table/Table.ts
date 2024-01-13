import { TableParams } from './TableParams'
import { TableServices } from './TableServices'
import { Field, newField } from './field/Field'
import { MultipleLinkedRecordsField } from './field/multipleLinkedRecords/MultipleLinkedRecordsField'
import { SingleLinkedRecordField } from './field/singleLinkedRecord/SingleLinkedRecordField'

export class Table {
  readonly name: string
  readonly fields: Field[]

  constructor(
    readonly params: TableParams,
    services: TableServices
  ) {
    const { name, fields } = params
    this.name = name
    this.fields = fields.map((field) => newField(field, services))
    if (!fields.find((field) => field.name === 'id')) {
      this.fields.push(newField({ type: 'single_line_text', name: 'id' }, services))
    }
    if (!fields.find((field) => field.name === 'created_time')) {
      this.fields.push(newField({ type: 'datetime', name: 'created_time' }, services))
    }
    if (!fields.find((field) => field.name === 'last_modified_time')) {
      this.fields.push(
        newField({ type: 'datetime', name: 'last_modified_time', optional: true }, services)
      )
    }
    if (!fields.find((field) => field.name === 'deleted_time')) {
      this.fields.push(
        newField({ type: 'datetime', name: 'deleted_time', optional: true }, services)
      )
    }
  }

  hasColumn(columnName: string): boolean {
    return this.fields.some((field) => field.name === columnName)
  }

  getSingleLinkedRecordFieldByName(fieldName: string): SingleLinkedRecordField {
    const field = this.fields.find((field) => field.name === fieldName)
    if (!field || !(field instanceof SingleLinkedRecordField)) {
      throw new Error(`Table "${this.name}" has no single_linked_record field named "${fieldName}"`)
    }
    return field
  }

  getMultipleLinkedRecordsFieldByName(fieldName: string): MultipleLinkedRecordsField {
    const field = this.fields.find((field) => field.name === fieldName)
    if (!field || !(field instanceof MultipleLinkedRecordsField)) {
      throw new Error(
        `Table "${this.name}" has no multiple_linked_records field named "${fieldName}"`
      )
    }
    return field
  }

  getLinkedFieldByLinkedTableName(linkedTableName: string): Field {
    const field = this.fields.find(
      (field) =>
        (field instanceof MultipleLinkedRecordsField || field instanceof SingleLinkedRecordField) &&
        field.table === linkedTableName
    )
    if (!field) {
      throw new Error(`Table "${this.name}" has no linked field for table "${linkedTableName}"`)
    }
    return field
  }
}
