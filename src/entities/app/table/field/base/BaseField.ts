import { AppDrivers } from '@entities/app/App'
import { BaseFieldOptions, Format } from './BaseFieldOptions'

export interface FieldPermissions {
  update?:
    | boolean
    | {
        formula: string
      }
}

export class BaseField {
  readonly type: string
  readonly name: string
  readonly optional: boolean
  readonly format: Format
  readonly default?: string | number | boolean
  readonly permissions?: FieldPermissions

  constructor(
    options: BaseFieldOptions,
    readonly drivers: AppDrivers
  ) {
    const { type, name, optional, format, default: defaultValue, permissions } = options
    this.type = type
    this.name = name
    this.optional = optional || false
    this.format = format || 'text'
    this.default = defaultValue
    this.permissions = permissions
  }
}
