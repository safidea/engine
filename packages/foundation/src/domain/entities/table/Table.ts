import { Field } from './Field'
import { DatetimeField } from './fields/DatetimeField'
import { MultipleLinkedRecordsField } from './fields/MultipleLinkedRecordsField'
import { SingleLineTextField } from './fields/SingleLineTextField'
import { SingleLinkedRecordField } from './fields/SingleLinkedRecordField'

export class Table {
  constructor(
    private readonly _name: string,
    private readonly _fields: Field[]
  ) {
    if (!this._fields.find((field) => field.name === 'id')) {
      this._fields.push(new SingleLineTextField('id', true))
    }
    if (!this._fields.find((field) => field.name === 'created_time')) {
      this._fields.push(new DatetimeField('created_time', true))
    }
    if (!this._fields.find((field) => field.name === 'last_modified_time')) {
      this._fields.push(new DatetimeField('last_modified_time', true))
    }
    if (!this._fields.find((field) => field.name === 'deleted_time')) {
      this._fields.push(new DatetimeField('deleted_time', true))
    }
  }

  get name(): string {
    return this._name
  }

  get fields(): Field[] {
    return this._fields
  }

  hasColumn(columnName: string): boolean {
    return this._fields.some((field) => field.name === columnName)
  }

  getLinkedFieldByLinkedTableName(linkedTableName: string): Field {
    const field = this._fields.find(
      (field) =>
        (field instanceof MultipleLinkedRecordsField || field instanceof SingleLinkedRecordField) &&
        field.table === linkedTableName
    )
    if (!field) {
      throw new Error(`Table ${this._name} has no linked field for table ${linkedTableName}`)
    }
    return field
  }
}
