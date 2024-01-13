import { TableServices } from '@entities/app/table/TableServices'

import { BaseFieldParams, BaseFieldFormat } from './BaseFieldParams'

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
  readonly format: BaseFieldFormat
  readonly default?: string | number | boolean
  readonly permissions?: FieldPermissions

  constructor(
    params: BaseFieldParams,
    readonly services: TableServices
  ) {
    const { type, name, optional, format, default: defaultValue, permissions } = params
    this.type = type
    this.name = name
    this.optional = optional || false
    this.format = format || 'text'
    this.default = defaultValue
    this.permissions = permissions
  }
}
