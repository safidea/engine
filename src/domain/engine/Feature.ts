import type { Base } from './base'
import type { Spec } from './spec/Spec'
import type { Logger } from '@domain/services/Logger'
import type { App } from './App'
import type { ConfigError } from '@domain/entities/error/Config'
import type { TestError } from '@domain/entities/error/Test'

interface Params {
  name: string
  specs: Spec[]
  logger: Logger
}

export class Feature implements Base {
  name: string

  constructor(private params: Params) {
    this.name = params.name
  }

  validateConfig() {
    const errors: ConfigError[] = []
    const { specs } = this.params
    if (specs) errors.push(...specs.flatMap((spec) => spec.validateConfig()))
    return errors
  }

  async test(callback: () => App): Promise<TestError[]> {
    const { logger, specs } = this.params
    const errors: TestError[] = []
    logger.log(`start testing specs`)
    const results = await Promise.all(specs.flatMap((spec) => spec.test(callback())))
    for (const result of results) if (result) errors.push(result)
    logger.log(`finish testing specs with ${errors.length} error(s)`)
    return errors
  }
}
