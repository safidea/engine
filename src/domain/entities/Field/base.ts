export interface BaseParams {
  name: string
  required?: boolean
  onMigration?: {
    replace?: string
  }
}

export class Base {
  name: string
  required: boolean
  onMigration?: {
    replace?: string
  }

  constructor(params: BaseParams) {
    this.name = params.name
    this.required = params.required || false
    this.onMigration = params.onMigration
  }
}
