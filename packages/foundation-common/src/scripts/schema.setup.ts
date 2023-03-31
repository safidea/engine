import fs from 'fs-extra'
import { resolve } from 'path'
import base from 'config-typescript/base.json'

import tsj from '../utils/tsj.utils'
import ajv from '../utils/ajv.utils'

import type { SchemaGeneratorParams, SchemaValidateError } from '../../types'

export async function validate(json: unknown, params: SchemaGeneratorParams): Promise<void> {
  const program = tsj.getProgramFromFiles([resolve(params.path)], base.compilerOptions)
  const schema = tsj.generateSchema(program, params.type)
  if (!schema) throw new Error('Error generating schema')
  const validate = ajv.compile(schema)
  const valid = validate(json)
  if (!valid && validate.errors)
    throw new Error(
      "Config file doesn't match expected schema:\n" +
        validate.errors.map((e: SchemaValidateError) => e.instancePath + ' ' + e.message).join('\n')
    )
}

export async function cache(json: unknown, path: string) {
  const currentCache = fs.readFileSync(path, 'utf8')
  const newCache = JSON.stringify(json, null, 2)
  const isUpdated = newCache !== currentCache
  if (isUpdated) fs.writeFileSync(path, newCache)
  return isUpdated
}
