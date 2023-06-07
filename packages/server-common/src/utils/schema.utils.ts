import AJVLib from '../libraries/ajv.library'

import type { AJVValidateFunctionType } from '../libraries/ajv.library'
import type { ObjectInterface } from 'shared-common'

class SchemaUtils {
  private validator: AJVValidateFunctionType

  constructor(schema: ObjectInterface) {
    this.validator = AJVLib.compile(schema)
  }

  public validate(obj: ObjectInterface): void {
    const valid = this.validator(obj)
    if (!valid && this.validator.errors) {
      const config = JSON.stringify(obj, null, 2)
      const errors = this.validator.errors
        .map((e) => `- ${e.instancePath ? `${e.instancePath} ` : ''}${e.message}`)
        .join('\n')
      throw new Error(`Invalid schema\n\nConfig: ${config}\n\nErrors:\n${errors}`)
    }
  }
}

export default SchemaUtils