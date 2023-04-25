import { resolve } from 'path'
import { AJVLib, TSJLib, ObjectInterface } from '@common/server'
import tsconfig from '../../../tsconfig.json'

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
  public validateFromType(obj: ObjectInterface, params: ValidateParams): void {
    const program = TSJLib.getProgramFromFiles([resolve(params.path)], tsconfig.compilerOptions)
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

export default new SchemaUtils()
