import { BaseField } from './BaseField'

export class SingleLineText extends BaseField {
  constructor(name: string, optional?: boolean) {
    super(name, 'single_line_text', optional)
  }
}
