import { BaseField } from './BaseField'

export class LongText extends BaseField {
  constructor(name: string, optional?: boolean) {
    super(name, 'long_text', optional)
  }
}
