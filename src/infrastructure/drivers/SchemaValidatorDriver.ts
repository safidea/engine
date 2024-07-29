import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { Driver } from '@adapter/spi/SchemaValidatorSpi'
import type { JSONSchema } from '@domain/services/SchemaValidator'

const dirname = new URL('.', import.meta.url).pathname

export class SchemaValidatorDriver implements Driver {
  private _ajv: Ajv

  constructor() {
    this._ajv = new Ajv({ allErrors: true, allowUnionTypes: true })
  }

  getSchemaFilePath = (schema: string) => {
    let schemaPath = join(dirname + '../schemas/', schema + '.schema.json')
    if (!fs.existsSync(schemaPath)) {
      schemaPath = join(process.cwd(), 'schemas/', schema + '.schema.json')
      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema ${schema} not found in ${schemaPath}`)
      }
    }
    return schemaPath
  }

  validateFromFile = (data: unknown, schema: string) => {
    const schemaPath = this.getSchemaFilePath(schema)
    const schemaJson = fs.readJSONSync(schemaPath)
    return this.validate(data, schemaJson)
  }

  validate = (data: unknown, schema: JSONSchema) => {
    const validate = this._ajv.compile(schema)
    if (validate(data)) return []
    return (validate.errors || []).map((error) => ({
      instancePath: error.instancePath,
      schemaPath: error.schemaPath,
      keyword: error.keyword,
      params: error.params,
      propertyName: error.propertyName,
      message: error.message,
    }))
  }
}
