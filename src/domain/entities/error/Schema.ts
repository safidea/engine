export interface Params {
  keyword: string
  instancePath: string
  schemaPath: string
  params: object
  propertyName?: string
  message?: string
}

export class SchemaError {
  public keyword: string
  public instancePath: string
  public schemaPath: string
  public params: object
  public propertyName?: string
  public message?: string

  constructor(params: Params) {
    this.message = params.message
    this.keyword = params.keyword
    this.instancePath = params.instancePath
    this.schemaPath = params.schemaPath
    this.params = params.params
    this.propertyName = params.propertyName
  }
}
