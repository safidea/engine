import * as tsj from 'ts-json-schema-generator'
import { validate } from 'jsonschema'

import type { Config } from '../types/config.type'

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const params = {
  path: './types/config.type.ts',
  tsconfig: './tsconfig.json',
  type: 'Config',
}

export default async function checkSchema(config: Config): Promise<void> {
  const schema = tsj.createGenerator(params).createSchema(params.type)
  const { valid, errors } = validate(config, schema)
  if (valid === false) {
    if (process.env.NODE_ENV !== 'test') console.error('Errors:', errors)
    throw new Error("Config file doesn't match expected schema")
  }
}
