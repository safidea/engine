import { BaseField, Format } from './BaseField'

export class RollupField extends BaseField {
  constructor(
    name: string,
    private readonly _linkedRecords: string,
    private readonly _linkedField: string,
    private readonly _formula: string,
    format?: Format,
    optional?: boolean
  ) {
    super(name, 'rollup', optional, format)
  }

  get linkedRecords(): string {
    return this._linkedRecords
  }

  get linkedField(): string {
    return this._linkedField
  }

  get formula(): string {
    return this._formula
  }
}
