import { Field } from './Field'

export class Table {
  constructor(
    private readonly _name: string,
    private readonly _fields: Field[]
  ) {}

  get name(): string {
    return this._name
  }

  get fields(): Field[] {
    return this._fields
  }
}
