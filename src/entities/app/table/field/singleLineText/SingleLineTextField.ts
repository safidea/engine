import { BaseField, FieldPermissions } from '../base/BaseField'

export class SingleLineTextField extends BaseField {
  constructor(
    name: string,
    optional?: boolean,
    defaultValue?: string,
    permissions?: FieldPermissions
  ) {
    super(name, 'single_line_text', optional, 'text', defaultValue, permissions)
  }
}
