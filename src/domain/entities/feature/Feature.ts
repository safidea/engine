import type { Server } from '@domain/services/Server'
import type { Engine } from '../Engine'
import type { SpecError } from '../spec/SpecError'
import type { Page } from '../page/Page'
import type { Spec } from '../spec/Spec'
import type { Table } from '../table/Table'
import type { Role } from '../role/Role'
import type { EngineError } from '../EngineError'
import { FeatureError } from './FeatureError'

export interface FeatureConfig {
  name: string
  role?: string
  specs: Spec[]
  pages: Page[]
  tables: Table[]
}

export interface FeatureParams {
  server: Server
  roles: Role[]
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
    if (role && !roles.find((r) => r.name === role)) {
      const error = new FeatureError('ROLE_NOT_FOUND', {
        feature: this.config.name,
        role,
      })
      errors.push(error)
    }
    if (specs) errors.push(...specs.flatMap((spec) => spec.validateConfig()))
    if (pages) errors.push(...pages.flatMap((page) => page.validateConfig()))
    if (tables) errors.push(...tables.flatMap((table) => table.validateConfig()))
    return errors
  }

  async testSpecs(): Promise<SpecError[]> {
    const errors: SpecError[] = []
    const results = await Promise.all(this.config.specs.flatMap((spec) => spec.test()))
    for (const result of results) if (result) errors.push(result)
    return errors.flat()
  }
}
