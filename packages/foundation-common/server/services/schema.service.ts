import fs from 'fs-extra'
import { resolve } from 'path'
import base from 'config-typescript/base.json'
import tsj from '../utils/tsj.utils'
import ajv from '../utils/ajv.utils'
import * as PathUtils from '../utils/path.utils'
import { DATA_FOLDER, ROOT_PATH } from '../settings/path.settings'

import type { ValidateParams, SchemaErrors } from '../../types'

class SchemaService {
  private cached = {}

  constructor() {
    const path = join(ROOT_PATH, DATA_FOLDER, `config.cache.json`)
    fs.ensureFileSync(path)
    const cached = fs.readFileSync(path, 'utf8')
    if (cached) this.cached = JSON.parse(cached)
  }

  validate(partialConfig: unknown, params: ValidateParams): void {
    const program = tsj.getProgramFromFiles([resolve(params.path)], base.compilerOptions)
    const schema = tsj.generateSchema(program, params.type)
    if (!schema) throw new Error('Error generating schema')
    const validate = ajv.compile(schema)
    const valid = validate(partialConfig)
    if (!valid && validate.errors) {
      const errors = validate.errors.map((e: SchemaErrors) => e.instancePath + ' ' + e.message)
      throw new Error("Config file doesn't match expected schema:\n" + errors.join('\n'))
    }
  }

  cache(partialConfig: unknown, name: string) {
    const path = PathUtils.cache(name)
    const currentCache = fs.readFileSync(path, 'utf8')
    const newCache = JSON.stringify(partialConfig, null, 2)
    const isUpdated = newCache !== currentCache
    if (isUpdated) fs.writeFileSync(path, newCache)
    return isUpdated
  }
}

const schemaService = new SchemaService()

export default schemaService
