import AJVLib from '@common/server/lib/ajv.lib'

import type { AJVValidateFunctionType } from '@common/server/lib/ajv.lib'
import type { ObjectInterface } from '@common'

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
