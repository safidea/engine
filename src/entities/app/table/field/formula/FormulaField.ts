import { BaseField, Format } from '../base/BaseField'

export class FormulaField extends BaseField {
  constructor(
    name: string,
    private readonly _formula: string,
    format?: Format,
    optional?: boolean
  ) {
    super(name, 'formula', optional, format)
  }

  get formula(): string {
    return this._formula
  }
}
