import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { JSONSchemaType } from 'ajv'
import type { Driver } from '@adapter/spi/SchemaValidatorSpi'

export class SchemaValidatorDriver implements Driver {
  private ajv: Ajv

  constructor() {
    this.ajv = new Ajv({ allErrors: true, allowUnionTypes: true })
  }

  validateSchema = <T>(data: unknown, schema: string) => {
    const schemaPath = join(process.cwd(), 'schemas/', schema + '.schema.json')
    const schemaJson: JSONSchemaType<T> = fs.readJSONSync(schemaPath)
    const validate = this.ajv.compile(schemaJson)
    if (validate(data)) return { json: data, errors: [] }
    return {
      errors: (validate.errors || []).map((error) => ({
        instancePath: error.instancePath,
        schemaPath: error.schemaPath,
        keyword: error.keyword,
        params: error.params,
        propertyName: error.propertyName,
        message: error.message,
      })),
    }
  }
}
