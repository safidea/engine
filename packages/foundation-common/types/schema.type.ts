export type SchemaGeneratorParams = {
  path: string
  type: string
}

export type SchemaValidateError = {
  instancePath: string
  message?: string
}
