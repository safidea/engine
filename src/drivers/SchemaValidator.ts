import Ajv from 'ajv'
import fs from 'fs-extra'
import { join } from 'path'
import type { JSONSchemaType } from 'ajv'
import type { ISchemaValidator, ISchemaValidatorSchema } from '@domain/drivers/ISchemaValidator'

class SchemaValidator implements ISchemaValidator {
  private ajv: Ajv

  constructor() {
    this.ajv = new Ajv({ allErrors: true })
  }

  validateSchema<T>(data: unknown, schema: ISchemaValidatorSchema) {
    const schemaPath = join(process.cwd(), 'schemas/', schema + '.schema.json')
    if (!fs.existsSync(schemaPath)) {
      throw new Error('Schema file not found: ' + schemaPath)
    }
    const schemaJson: JSONSchemaType<T> = fs.readJSONSync(schemaPath)
    const validate = this.ajv.compile(schemaJson)
    if (validate(data)) {
      return { json: data }
    }
    if (!validate.errors) {
      throw new Error(`No AJV errors found while ${schema} schema is invalid`)
    }
    return {
      errors: validate.errors.map((error) => ({
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

export default new SchemaValidator()
