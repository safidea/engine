export interface BaseParams {
  name: string
  required?: boolean
}

export class Base {
  name: string
  required: boolean

  constructor(params: BaseParams) {
    this.name = params.name
    this.required = params.required || false
  }
}
