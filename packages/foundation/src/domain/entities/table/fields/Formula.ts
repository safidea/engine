import { BaseField, Format } from './BaseField'

export class Formula extends BaseField {
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
