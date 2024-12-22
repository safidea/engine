export interface BaseFieldParams {
  name: string
  required?: boolean
  onMigration?: {
    replace?: string
  }
}

export class BaseField {
  name: string
  required: boolean
  onMigration?: {
    replace?: string
  }

  constructor(params: BaseFieldParams) {
    this.name = params.name
    this.required = params.required || false
    this.onMigration = params.onMigration
  }
}
