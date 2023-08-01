import { BaseField } from './BaseField'

export class SingleLineText extends BaseField {
  constructor(name: string, optional?: boolean, defaultValue?: string) {
    super(name, 'single_line_text', optional, 'text', defaultValue)
  }
}
