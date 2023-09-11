import { BaseField } from './BaseField'

export class SingleSelectField extends BaseField {
  constructor(
    name: string,
    private readonly _options: string[],
    optional?: boolean,
    defaultValue?: string | number | boolean
  ) {
    super(name, 'single_select', optional, 'text', defaultValue)
  }

  get options(): string[] {
    return this._options
  }
}
