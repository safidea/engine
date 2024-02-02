import type { Server } from '@domain/services/Server'
import type { Engine } from '../Engine'
import type { RoleList } from '../role/RoleList'
import type { SpecList } from '../spec/SpecList'
import type { PageList } from '../page/PageList'
import type { TableList } from '../table/TableList'
import type { SpecError } from '../spec/SpecError'
import type { EngineError } from '../EngineError'
import { FeatureError } from './FeatureError'

export interface FeatureConfig {
  name: string
  role?: string
  specs?: SpecList
  pages?: PageList
  tables?: TableList
}

export interface FeatureParams {
  server: Server
  roles: RoleList
}

export class Feature implements Engine {
  name: string

  constructor(
    private config: FeatureConfig,
    private params: FeatureParams
  ) {
    this.name = config.name
  }

  validateConfig() {
    const errors: EngineError[] = []
    const { specs, pages, tables, role } = this.config
    const { roles } = this.params
    if (role && !roles.includes(role)) {
      const error = new FeatureError('ROLE_NOT_FOUND', {
        feature: this.config.name,
        role,
      })
      errors.push(error)
    }
    if (specs) errors.push(...specs.validateConfig())
    if (pages) errors.push(...pages.validateConfig())
    if (tables) errors.push(...tables.validateConfig())
    return errors
  }

  async testSpecs(): Promise<SpecError[]> {
    return this.config.specs?.test() ?? []
  }

  hasTables() {
    return !!this.config.tables
  }

  hasPages() {
    return !!this.config.pages
  }

  getTables() {
    return this.config.tables?.all ?? []
  }

  getPages() {
    return this.config.pages?.all ?? []
  }
}
