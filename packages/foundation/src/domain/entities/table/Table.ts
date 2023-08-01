import { Field } from './Field'
import { Datetime } from './fields/Datetime'
import { SingleLineText } from './fields/SingleLineText'

export class Table {
  constructor(
    private readonly _name: string,
    private readonly _fields: Field[]
  ) {
    if (!this._fields.find((field) => field.name === 'id')) {
      this._fields.push(new SingleLineText('id', true))
    }
    if (!this._fields.find((field) => field.name === 'created_time')) {
      this._fields.push(new Datetime('created_time', true))
    }
    if (!this._fields.find((field) => field.name === 'last_modified_time')) {
      this._fields.push(new Datetime('last_modified_time', true))
    }
    if (!this._fields.find((field) => field.name === 'deleted_time')) {
      this._fields.push(new Datetime('deleted_time', true))
    }
  }

  get name(): string {
    return this._name
  }

  get fields(): Field[] {
    return this._fields
  }
}
