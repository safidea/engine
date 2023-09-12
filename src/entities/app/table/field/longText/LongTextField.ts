import { BaseField } from '../base/BaseField'

export class LongTextField extends BaseField {
  constructor(name: string, optional?: boolean, defaultValue?: string) {
    super(name, 'long_text', optional, 'text', defaultValue)
  }
}
