import { BaseField } from './BaseField'

export class SingleSelect extends BaseField {
  constructor(
    name: string,
    private readonly _options: string[],
    optional?: boolean,
    defaultValue?: string
  ) {
    super(name, 'single_select', optional, 'text', defaultValue)
  }

  get options(): string[] {
    return this._options
  }
}
