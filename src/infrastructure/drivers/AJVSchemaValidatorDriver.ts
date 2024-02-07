import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { JSONSchemaType } from 'ajv'
import type { Driver } from '@adapter/spi/SchemaValidatorSpi'
import type { Params, SchemaName } from '@domain/services/SchemaValidator'

export class AJVSchemaValidatorDriver implements Driver {
  private ajv: Ajv

  constructor(public params: Params) {
    this.ajv = new Ajv({ allErrors: true, allowUnionTypes: true })
  }

  validateSchema = <T>(data: unknown, schema: SchemaName) => {
    const schemaPath = join(process.cwd(), 'schemas/', schema + '.schema.json')
    const schemaJson: JSONSchemaType<T> = fs.readJSONSync(schemaPath)
    const validate = this.ajv.compile(schemaJson)
    if (validate(data)) return { json: data, errors: [] }
    return {
      errors: (validate.errors || []).map((error) => ({
        schema,
        instancePath: error.instancePath,
        keyword: error.keyword,
        params: {
          missingProperty: error.params.missingProperty,
          additionalProperty: error.params.additionalProperty,
        },
      })),
    }
  }
}
