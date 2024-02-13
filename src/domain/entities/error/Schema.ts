export interface Params {
  keyword: string
  instancePath: string
  schemaPath: string
  params: object
  propertyName?: string
  message?: string
}

export class SchemaError {
  constructor(private params: Params) {}
}
