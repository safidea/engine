import fs from 'fs-extra'
import debug from 'debug'
import { resolve } from 'path'
import base from 'config-typescript/base.json'
import tsj from '../utils/tsj.utils'
import ajv from '../utils/ajv.utils'
import { ObjectUtils } from '../../shared'
import { CONFIG_CACHE_PATH } from '../constants/path.constants'
import { ConfigService } from './config.service'

import type { Config } from '../../types'

const log: debug.IDebugger = debug('initializer')

interface ValidateParams {
  path: string
  type: string
  name: string
}

interface SchemaErrors {
  instancePath: string
  message?: string
}

class InitializerService {
  private cache: Config = {}
  private errors: string[] = []

  constructor() {
    fs.ensureFileSync(CONFIG_CACHE_PATH)
    const cache = fs.readFileSync(CONFIG_CACHE_PATH, 'utf8')
    if (cache) this.cache = JSON.parse(cache)
  }

  isUpdated(partialConfig: Config, path: string): boolean {
    const currentCache = JSON.stringify(ObjectUtils.getAtPath(this.cache, path), null, 2)
    const newCache = JSON.stringify(partialConfig, null, 2)
    if (currentCache === newCache) return false
    this.cache = ObjectUtils.setAtPath(this.cache, path, partialConfig)
    return true
  }

  validateSchemaFromType(partialConfig: Config, params: ValidateParams): boolean {
    const program = tsj.getProgramFromFiles([resolve(params.path)], base.compilerOptions)
    const schema = tsj.generateSchema(program, params.type)
    if (!schema) throw new Error('Error generating schema')
    const validate = ajv.compile(schema)
    const valid = validate(partialConfig)
    if (!valid && validate.errors) {
      this.errors.push(
        ...validate.errors.map(
          (e: SchemaErrors) => `${params.type} ${params.name}: ${e.instancePath} ${e.message}`
        )
      )
    }
    return valid
  }

  run() {
    if (this.errors.length > 0) {
      log('Initialization failed')
      return log(this.errors.join('\n'))
    }

    DatabaseService.build(this.cache.tables)
    log('Database has been built')

    fs.writeFileSync(CONFIG_CACHE_PATH, this.cache)
    log('Cache has been updated')

    ConfigService.updateFromCache(this.cache)
    log('Initialization completed')
  }
}

const service = new InitializerService()

export default service
