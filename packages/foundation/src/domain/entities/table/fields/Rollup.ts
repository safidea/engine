import { BaseField, Format } from './BaseField'

export class Rollup extends BaseField {
  constructor(
    name: string,
    private readonly _linked_records: string,
    private readonly _linked_field: string,
    private readonly _formula: string,
    format?: Format,
    optional?: boolean
  ) {
    super(name, 'rollup', optional, format)
  }

  get linkedRecords(): string {
    return this._linked_records
  }

  get linkedField(): string {
    return this._linked_field
  }

  get formula(): string {
    return this._formula
  }
}
