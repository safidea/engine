import fs from 'fs-extra'
import { join } from 'path'
import * as tsj from 'ts-json-schema-generator'
import { validate } from 'jsonschema'

import type { SchemaGeneratorParams } from '../../types'

export async function readFile(): Promise<unknown> {
  const { FOUNDATION_CONFIG_FILE } = process.env
  if (!FOUNDATION_CONFIG_FILE) throw new Error('FOUNDATION_CONFIG_FILE not set')
  const path = join(__dirname, '../..', FOUNDATION_CONFIG_FILE as string)
  const exists = await fs.pathExists(path)
  if (!exists) throw new Error(`Config file not found: ${path}`)
  const file = fs.readFileSync(path, 'utf8')
  try {
    return JSON.parse(file)
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(`Error parsing config file: ${error.message}`)
  }
}

export async function validateSchema(
  json: unknown,
  params: SchemaGeneratorParams
): Promise<boolean> {
  const schema = tsj.createGenerator(params).createSchema(params.type)
  const { valid, errors } = validate(json, schema)
  if (valid === false)
    throw new Error("Config file doesn't match expected schema\n" + JSON.stringify(errors.map(e => e.message), null, 2))
  return valid
}
