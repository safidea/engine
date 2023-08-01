import { Field } from './Field'
import { Datetime } from './fields/Datetime'
import { SingleLineText } from './fields/SingleLineText'

export class Table {
  constructor(
    private readonly _name: string,
    private readonly _fields: Field[]
  ) {
    this._fields.push(
      new SingleLineText('id', true),
      new Datetime('created_time', true),
      new Datetime('last_modified_time', true),
      new Datetime('deleted_time', true)
    )
  }

  get name(): string {
    return this._name
  }

  get fields(): Field[] {
    return this._fields
  }
}
