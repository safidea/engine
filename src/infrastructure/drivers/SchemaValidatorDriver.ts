import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { Driver } from '@adapter/spi/SchemaValidatorSpi'

const dirname = new URL('.', import.meta.url).pathname

export class SchemaValidatorDriver implements Driver {
  private ajv: Ajv

  constructor() {
    this.ajv = new Ajv({ allErrors: true, allowUnionTypes: true })
  }

  getSchemaPath = (schema: string) => {
    let schemaPath = join(dirname + '../schemas/', schema + '.schema.json')
    if (!fs.existsSync(schemaPath)) {
      schemaPath = join(process.cwd(), 'schemas/', schema + '.schema.json')
      if (!fs.existsSync(schemaPath)) {
        throw new Error(`Schema ${schema} not found in ${schemaPath}`)
      }
    }
    return schemaPath
  }

  validateSchema = (data: unknown, schema: string) => {
    const schemaPath = this.getSchemaPath(schema)
    const schemaJson = fs.readJSONSync(schemaPath)
    const validate = this.ajv.compile(schemaJson)
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
