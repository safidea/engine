import { BaseField, FieldPermissions } from './BaseField'

export class SingleLineText extends BaseField {
  constructor(name: string, optional?: boolean, defaultValue?: string, permissions?: FieldPermissions) {
    super(name, 'single_line_text', optional, 'text', defaultValue, permissions)
  }
}
