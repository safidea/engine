import { resolve } from 'path'
import base from 'config-typescript/base.json'
import { AJVLib, TSJLib, ObjectInterface } from '@server'

interface ValidateParams {
  path: string
  type: string
  name: string
}

interface SchemaErrors {
  instancePath: string
  message?: string
}

const TSJSettings = {
  required: true,
}

class SchemaUtils {
  validateFromType(obj: ObjectInterface, params: ValidateParams): void {
    const program = TSJLib.getProgramFromFiles([resolve(params.path)], base.compilerOptions)
    const schema = TSJLib.generateSchema(program, params.type, TSJSettings)
    if (schema) {
      const validate = AJVLib.compile(schema)
      const valid = validate(obj)
      if (!valid && validate.errors) {
        throw new Error(
          validate.errors
            .map(
              (e: SchemaErrors) =>
                `- ${params.name} ${e.message} ${e.instancePath ? `at ${e.instancePath}` : ''}`
            )
            .join('\n')
        )
      }
    }
  }
}

const schemaUtils = new SchemaUtils()
export default schemaUtils
