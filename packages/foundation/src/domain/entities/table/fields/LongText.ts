import { BaseField } from './BaseField'

export class LongText extends BaseField {
  constructor(name: string, optional?: boolean, defaultValue?: string) {
    super(name, 'long_text', optional, 'text', defaultValue)
  }
}
