import * as tsj from 'ts-json-schema-generator'
import { validate } from 'jsonschema'

import type { Config } from '../types/config.type'

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const params = {
  path: './types/config.type.ts',
  tsconfig: './tsconfig.json',
  type: 'Config',
}

export default function checkSchema(config: Config): void {
  const schema = tsj.createGenerator(params).createSchema(params.type)
  const { valid, errors } = validate(config, schema)
  if (valid === false) {
    let errorMessage = "Config file doesn't match expected schema:"
    errors.forEach(
      (e, i) =>
        (errorMessage += `\n${++i}) ${e.property} ${e.message}`.replace('instance', 'config'))
    )
    throw new Error(errorMessage)
  }
}
