import { Field } from './field/Field'
import { DatetimeField } from './field/datetime/DatetimeField'
import { MultipleLinkedRecordsField } from './field/multipleLinkedRecords/MultipleLinkedRecordsField'
import { SingleLineTextField } from './field/singleLineText/SingleLineTextField'
import { SingleLinkedRecordField } from './field/singleLinkedRecord/SingleLinkedRecordField'

export class Table {
  constructor(
    readonly name: string,
    readonly fields: Field[]
  ) {
    if (!fields.find((field) => field.name === 'id')) {
      fields.push(new SingleLineTextField('id', true))
    }
    if (!fields.find((field) => field.name === 'created_time')) {
      fields.push(new DatetimeField('created_time', true))
    }
    if (!fields.find((field) => field.name === 'last_modified_time')) {
      fields.push(new DatetimeField('last_modified_time', true))
    }
    if (!fields.find((field) => field.name === 'deleted_time')) {
      fields.push(new DatetimeField('deleted_time', true))
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
