import { BaseField, FieldPermissions } from '../base/BaseField'

export class UrlField extends BaseField {
  constructor(
    name: string,
    optional?: boolean,
    defaultValue?: string,
    permissions?: FieldPermissions
  ) {
    super(name, 'url', optional, 'text', defaultValue, permissions)
  }
}
